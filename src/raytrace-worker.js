import { Vec3 } from './vec3.js';

const PI_OVER180 = Math.PI / 180;

self.addEventListener('message', (e) => {
    const data = e.data;
    const scene = data.scene;

    const raytracer = new RayTracer(scene);
    raytracer.render();

    self.postMessage(raytracer.buffer);

}, false);

class RayTracer {
    scene;
    buffer;

    constructor(scene) {
        this.scene = scene;

        this.buffer = new ImageData(scene.imageWidth, scene.imageHeight);
    }

    render() {
        let t;
        const scene = this.scene;
        const imageWidth = scene.imageWidth;
        const imageHeight = scene.imageHeight;

        // Projection distance
        const invProjDist = 1.0 / (0.5 * scene.imageWidth / Math.tan(PI_OVER180 * 0.5 * scene.fov));

        // For each pixel
        for (let y = 0; y < scene.imageHeight; ++y) {
            for (let x = 0; x < scene.imageWidth; ++x) {
                let red = 0, green = 0, blue = 0,
                    rho = 1.0,
                    currentDepth = 0;

                // Conic ray projection
                const viewRay = {};
                viewRay.origin = new Vec3((0.5 * imageWidth) + scene.eyePoint.x,
                    (0.5 * imageHeight) + scene.eyePoint.y, scene.eyePoint.z);
                viewRay.dir = new Vec3(((x + scene.lookAt.x) - 0.5 * imageWidth) * invProjDist,
                    ((y + scene.lookAt.y) - 0.5 * imageHeight) * invProjDist, 1.0 - scene.lookAt.z).normalize();

                // Start shooting rays
                do
                {
                    t = Number.MAX_VALUE; // t = infinity
                    let currentSphere = -1;

                    // Check for ray intersection with any objects
                    for (let i = 0; i < scene.spheres.length; ++i) {
                        const hitInfo = this.#hitSphere(viewRay, scene.spheres[i], t);
                        if (hitInfo.hit === true) {
                            t = hitInfo.t;
                            currentSphere = i;
                        }
                    }

                    // If nothing is hit bail
                    if (currentSphere === -1) {
                        red += rho * scene.background.r;
                        green += rho * scene.background.g;
                        blue += rho * scene.background.b;
                        break;
                    }

                    // Find intersection point and normal
                    const newStart = viewRay.origin.add(viewRay.dir.mult(t)),
                        n = newStart.sub(new Vec3(scene.spheres[currentSphere].position)).normalize();

                    // Get the material for the sphere hit
                    const currentMaterial = scene.materials[scene.spheres[currentSphere].materialId];

                    // Cast shadow feelers for all lights
                    const lightRay = {
                        origin: newStart.clone(),
                        dir: new Vec3(0, 0, 0)
                    };

                    for (let j = 0; j < scene.lights.length; ++j) {
                        const currentLight = scene.lights[j];

                        // Trace the ray from the intersection point
                        // back to the light
                        lightRay.dir = new Vec3(currentLight.position).sub(newStart);
                        let fLightProj = lightRay.dir.dot(n);
                        if (fLightProj <= 0.0) {
                            continue;
                        }

                        const LightDist = lightRay.dir.norm();
                        if (LightDist === 0) {
                            continue;
                        }

                        fLightProj /= LightDist;
                        lightRay.dir = lightRay.dir.normalize();

                        // Check if the light ray is intersecting with anything
                        let inShadow = false;
                        t = LightDist;
                        for (let i = 0; i < scene.spheres.length; ++i) {
                            const hitInfo = this.#hitSphere(lightRay, scene.spheres[i], t);
                            if (hitInfo.hit === true) {
                                //t = hitInfo.t;
                                inShadow = true;
                                break;
                            }
                        }
                        if (!inShadow) {
                            // Calculate lighting
                            // Lambert diffuse
                            const lambert = lightRay.dir.dot(n) * rho;
                            red += lambert * currentLight.r * currentMaterial.r;
                            green += lambert * currentLight.g * currentMaterial.g;
                            blue += lambert * currentLight.b * currentMaterial.b;

                            // Blinn-Phong specular
                            const fViewProj = viewRay.dir.dot(n),
                                blinnDir = lightRay.dir.sub(viewRay.dir),
                                normSquared = blinnDir.dot(blinnDir);

                            if (normSquared !== 0) {
                                let Blinn = (1.0 / Math.sqrt(normSquared)) * Math.max(fLightProj - fViewProj, 0.0);
                                Blinn = rho * Math.pow(Blinn, currentMaterial.power);
                                red += Blinn * currentLight.r * currentMaterial.specular.r;
                                green += Blinn * currentLight.g * currentMaterial.specular.g;
                                blue += Blinn * currentLight.b * currentMaterial.specular.b;
                            }
                        }
                    }

                    // Calculate reflection vector
                    rho *= currentMaterial.reflection;
                    const reflect = viewRay.dir.dot(n) * -2;
                    viewRay.origin = newStart.clone();
                    viewRay.dir = viewRay.dir.add(n.mult(reflect));
                    currentDepth++;

                } while ((rho > 0.0) && (currentDepth <= scene.traceDepth));

                // Exponential Exposure Control
                red = 1.0 - Math.exp(red * scene.exposureValue);
                green = 1.0 - Math.exp(green * scene.exposureValue);
                blue = 1.0 - Math.exp(blue * scene.exposureValue);

                // Gamma correction
                if (scene.sRGB) {
                    red = this.#sRGB(red);
                    green = this.#sRGB(green);
                    blue = this.#sRGB(blue);
                }

                // Clamp and write final pixel colors mapped to 0-255
                const pxIdx = (x + y * scene.imageWidth) * 4;

                this.buffer.data[pxIdx] = Math.min(red * 255.0, 255.0);
                this.buffer.data[pxIdx + 1] = Math.min(green * 255.0, 255.0);
                this.buffer.data[pxIdx + 2] = Math.min(blue * 255.0, 255.0);
                this.buffer.data[pxIdx + 3] = 255;
            }
        }
    }

    /**
     * Ray-Sphere intersection test
     *
     * @param ray
     * @param sphere
     * @param t
     * @returns {{hit: boolean, t: number}}
     */
    #hitSphere(ray, sphere, t) {
        const dist = new Vec3(sphere.position).sub(ray.origin);

        const b = ray.dir.dot(dist);
        const d = b * b - dist.dot(dist) + sphere.radius * sphere.radius;

        if (d < 0.0) {
            return { hit: false, t: Number.MAX_VALUE };
        }

        // Solve for the 2 roots and save the closest one
        const sqrt = Math.sqrt(d);
        const t0 = b - sqrt;
        const t1 = b + sqrt;

        let result = false;
        if (t0 > 0.1 && t0 < t) {
            t = t0;
            result = true;
        }
        if (t1 > 0.1 && t1 < t) {
            t = t1;
            result = true;
        }

        return {
            hit: result,
            t: t
        };
    }

    #sRGB(c) {
        // Gamma correction function
        if (c <= 0.0031308) {
            return 12.92 * c;

        } else {
            return 1.055 * Math.pow(c, 0.4166667) - 0.055;
        }
    }
}
