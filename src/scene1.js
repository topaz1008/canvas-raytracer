// Scene definition object
export const scene = {
    imageWidth: 1280,
    imageHeight: 720,
    traceDepth: 2,
    sRGB: false,
    background: { r: 0.15, g: 0.15, b: 0.15 },

    eyePoint: { x: -250, y: -150, z: -1300 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 45,
    exposureValue: -1.45,

    materials: [
        {
            r: 1, g: 0, b: 0,
            specular: { r: 0.9, g: 0.9, b: 0.9 },
            power: 150,
            reflection: 0.5
        },
        {
            r: 0, g: 1, b: 0,
            specular: { r: 0.9, g: 0.9, b: 0.9 },
            power: 165,
            reflection: 0.7
        },
        {
            r: 0, g: 0, b: 1,
            specular: { r: 0.9, g: 0.9, b: 0.9 },
            power: 150,
            reflection: 0.7
        },
        {
            r: 0.8, g: 0.8, b: 0.8,
            specular: { r: 0.9, g: 0.9, b: 0.9 },
            power: 150,
            reflection: 0.7
        },
        {
            r: 1, g: 0.5, b: 0,
            specular: { r: 0.9, g: 0.9, b: 0.9 },
            power: 350,
            reflection: 0.5
        }
    ],
    spheres: [
        {
            position: { x: 100, y: 150, z: -13 },
            radius: 110,
            materialId: 0
        },
        {
            position: { x: 350, y: 96, z: 0 },
            radius: 60,
            materialId: 1
        },
        {
            position: { x: 500, y: 100, z: 0 },
            radius: 70,
            materialId: 2
        },
        {
            position: { x: 700, y: 200, z: 350 },
            radius: 100,
            materialId: 3
        },
        {
            position: { x: 330, y: 300, z: 450 },
            radius: 100,
            materialId: 4
        }
    ],
    lights: [
        {
            position: { x: 0, y: 80, z: -110 },
            r: 1,
            g: 1,
            b: 1
        },
        {
            position: { x: 213, y: 80, z: -1000 },
            r: 1,
            g: 1,
            b: 1
        }
    ]
};
