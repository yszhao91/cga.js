import * as THREE from "three"
export const DiamondShader = {
    defines: {
        RAY_BOUNCES: 5
    },
    vertexShader: ["varying vec2 vUv;", "varying vec3 Normal;", "varying vec3 worldNormal;", "varying vec3 vecPos;", "varying vec3 viewPos;", "void main() {", "vUv = uv;", "Normal =  normal;", "worldNormal = (modelMatrix * vec4(normal,0.0)).xyz;", "vecPos = (modelMatrix * vec4(position, 1.0 )).xyz;", "viewPos = (modelViewMatrix * vec4(position, 1.0 )).xyz;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
    fragmentShader: ["varying vec2 vUv;", "varying vec3 Normal;", "varying vec3 worldNormal;", "varying vec3 vecPos;", "varying vec3 viewPos;", "uniform samplerCube tCubeMapNormals;", "uniform samplerCube envMap;", "uniform samplerCube envRefractionMap;", "uniform sampler2D sphereMap;", "uniform float envMapIntensity;", "uniform float tanAngleSqCone;", "uniform float coneHeight;", "uniform int maxBounces;", "uniform mat4 modelMatrix;", "uniform mat4 invModelMatrix;", "uniform float n2;", "uniform float radius;", "uniform bool bDebugBounces;", "uniform float rIndexDelta;", "uniform float normalOffset;", "uniform float squashFactor;", "uniform float distanceOffset;", "uniform float geometryFactor;", "uniform vec3 Absorbption;", "uniform vec3 colorCorrection;", "uniform vec3 boostFactors;", "uniform vec3 centreOffset;", "vec3 BRDF_Specular_GGX_Environment( const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {", "float dotNV = abs( dot( normal, viewDir ) );", "const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );", "const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );", "vec4 r = roughness * c0 + c1;", "float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;", "vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;", "return specularColor * AB.x + AB.y;", "}", "vec4 SampleSpecularReflection(vec4 specularColor, vec3 direction ) {", "direction.x *= -1.0;", "direction.z *= -1.0;", "vec3 tempDir = normalize(vec3(0., 0., 1.) + direction);", "vec4 sampleColorRGB = envMapIntensity * envMapTexelToLinear( textureCube( envMap, direction ) );", "vec4 sampleColorRefraction = envMapIntensity * ( texture2D( sphereMap, tempDir.xy * 0.5 + 0.5 ) );", "vec3 toneMappedColor = pow(toneMapping(sampleColorRGB.rgb),vec3(1./1.));", "return vec4(toneMappedColor, 1.0);", "}", "vec4 SampleSpecularContribution(vec4 specularColor, vec3 direction ) {", "direction = normalize(direction);", "direction.x *= -1.0;", "direction.z *= -1.0;", "vec4 sampleColorRGB = envMapIntensity * envMapTexelToLinear( textureCube( envMap, direction ) );", "vec3 tempDir = normalize(vec3(0., 0., 1.) + direction);", "float m = 2.8284271247461903 * sqrt( direction.z+1.0 );", "vec4 sampleColorRefraction = envMapIntensity * texture2D( sphereMap, clamp(direction.xy / m + 0.45, vec2(0.), vec2(1.)) );", "vec3 toneMappedColor = pow(toneMapping( sampleColorRGB.rgb ),vec3(1./1.));", "return vec4(toneMappedColor, 1.0);", "}", "vec3 intersectSphere(vec3 origin, vec3 direction) {", "origin -= centreOffset;", "direction.y /= squashFactor;", "float A = dot(direction, direction);", "float B = 2.0*dot(origin, direction);", "float C = dot(origin, origin) - radius * radius;", "float disc = B*B - 4.0 * A * C;", "if(disc > 0.0)", "{", "disc = sqrt(disc);", "float t1 = (-B + disc)*geometryFactor/A;", "float t2 = (-B - disc)*geometryFactor/A;", "float t = (t1 > t2) ? t1 : t2;", "direction.y *= squashFactor;", "return vec3(origin + centreOffset + direction * t);", "}", "return vec3(0.0);", "}", "vec3 debugBounces(int count) {", "vec3 color = vec3(1.,1.,1.);", "if(count == 1)", "color = vec3(0.0,1.0,0.0);", "else if(count == 2)", "color = vec3(0.0,0.0,1.0);", "else if(count == 3)", "color = vec3(1.0,1.0,0.0);", "else if(count == 4)", "color = vec3(0.0,1.0,1.0);", "else", "color = vec3(0.0,1.0,0.0);", "if(count ==0)", "color = vec3(1.0,0.0,0.0);", "return color;", "}", "vec3 traceRay(vec3 origin, vec3 direction, vec3 normal) {", "vec3 outColor = vec3(0.0);", "// Reflect/Refract ray entering the diamond", "const float n1 = 1.0;", "const float epsilon = 1e-4;", "float f0 = (2.4- n1)/(2.4 + n1);", "f0 *= f0;", "vec3 attenuationFactor = vec3(1.0);", "vec3 newDirection = refract(direction, normal, n1/n2);", "vec3 reflectedDirection = reflect(direction, normal);", "vec3 brdfReflected = BRDF_Specular_GGX_Environment(reflectedDirection, normal, vec3(f0), 0.0);", "vec3 brdfRefracted = BRDF_Specular_GGX_Environment(newDirection, -normal, vec3(f0), 0.0);", "attenuationFactor *= ( vec3(1.0) - brdfRefracted);", "outColor += SampleSpecularReflection(vec4(1.0), reflectedDirection ).rgb * brdfReflected;", "int count = 0;", "newDirection = (invModelMatrix * vec4(newDirection, 0.0)).xyz;", "newDirection = normalize(newDirection);", "origin = (invModelMatrix * vec4(origin, 1.0)).xyz;", "// ray bounces ", "for( int i=0; i<RAY_BOUNCES; i++) { ", "vec3 intersectedPos;", "intersectedPos = intersectSphere(origin + vec3(epsilon), newDirection);", "vec3 dist = intersectedPos - origin;", "vec3 d = normalize(intersectedPos - centreOffset);", "vec3 mappedNormal = textureCube( tCubeMapNormals, d ).xyz;", "mappedNormal = 2. * mappedNormal - 1.;", "mappedNormal.y += normalOffset;", "mappedNormal = normalize(mappedNormal);", "dist = (modelMatrix * vec4(dist, 1.)).xyz;", "float r = sqrt(dot(dist, dist));", "attenuationFactor *= exp(-r*Absorbption);", "// refract the ray at first intersection ", "vec3 oldOrigin = origin;", "origin = intersectedPos - normalize(intersectedPos - centreOffset) * distanceOffset;", "vec3 oldDir = newDirection;", "newDirection = refract(newDirection, mappedNormal, n2/n1);", "if( dot(newDirection, newDirection) == 0.0) { // Total Internal Reflection. Continue inside the diamond ", "newDirection = reflect(oldDir, mappedNormal);", "if(i == RAY_BOUNCES-1 ) //If the ray got trapped even after max iterations, simply sample along the outgoing refraction! ", "{", "vec3 brdfReflected = BRDF_Specular_GGX_Environment(-oldDir, mappedNormal, vec3(f0), 0.0);", "vec3 d1 = (modelMatrix * vec4(oldDir, 0.0)).xyz;", "outColor += SampleSpecularContribution(vec4(1.0), d1 ).rgb * colorCorrection * attenuationFactor  * boostFactors * (vec3(1.0) - brdfReflected);", "//outColor = vec3(1.,0.,0.);", "//if(d1.y > 0.95) {", "//outColor += d1.y * vec3(1.,0.,0) * attenuationFactor * (vec3(1.0) - brdfReflected) * boostFactors;", "//}", "}", "} else { // Add the contribution from outgoing ray, and continue the reflected ray inside the diamond ", "vec3 brdfRefracted = BRDF_Specular_GGX_Environment(newDirection, -mappedNormal, vec3(f0), 0.0);", "// outgoing(refracted) ray's contribution ", "vec3 d1 = (modelMatrix * vec4(newDirection, 0.0)).xyz;", "vec3 colorG = SampleSpecularContribution(vec4(1.0), d1 ).rgb * ( vec3(1.0) - brdfRefracted);", "vec3 dir1 = refract(oldDir, mappedNormal, (n2+rIndexDelta)/n1);", "vec3 dir2 = refract(oldDir, mappedNormal, (n2-rIndexDelta)/n1);", "vec3 d2 = (modelMatrix * vec4(dir1, 0.0)).xyz;", "vec3 d3 = (modelMatrix * vec4(dir2, 0.0)).xyz;", "vec3 colorR = SampleSpecularContribution(vec4(1.0), d2 ).rgb * ( vec3(1.0) - brdfRefracted);", "vec3 colorB = SampleSpecularContribution(vec4(1.0), d3 ).rgb * ( vec3(1.0) - brdfRefracted);", "outColor += vec3(colorR.r, colorG.g, colorB.b) * colorCorrection * attenuationFactor * boostFactors;", "//outColor = oldDir;", "//new reflected ray inside the diamond ", "newDirection = reflect(oldDir, mappedNormal);", "vec3 brdfReflected = BRDF_Specular_GGX_Environment(newDirection, mappedNormal, vec3(f0), 0.0);", "attenuationFactor *= brdfReflected * boostFactors;", "count++;", "}", "}", "if(false)", "outColor = debugBounces(count);", "return outColor;", "}", "void main() {", "vec3 normalizedNormal = normalize(worldNormal);", "vec3 viewVector = normalize(vecPos - cameraPosition);", "vec3 color = traceRay(vecPos, viewVector, normalizedNormal);", "gl_FragColor = vec4(color.rgb,1.);", "#include <tonemapping_fragment>", "//#include <encodings_fragment>", "//gl_FragColor = textureCube(tCubeMapNormals, normalize(Normal));", "}"].join("\n"),
    uniforms: {
        tCubeMapNormals: {
            type: "t",
            value: null
        },
        envMap: {
            type: "t",
            value: null
        },
        envRefractionMap: {
            type: "t",
            value: null
        },
        sphereMap: {
            type: "t",
            value: null
        },
        envMapIntensity: {
            type: "f",
            value: 1
        },
        maxBounces: {
            type: "i",
            value: 1
        },
        tanAngleSqCone: {
            type: "f",
            value: 0
        },
        coneHeight: {
            type: "f",
            value: 0
        },
        bDebugBounces: {
            type: "i",
            value: !1
        },
        rIndexDelta: {
            type: "f",
            value: .012
        },
        n2: {
            type: "f",
            value: 2.4
        },
        radius: {
            type: "f",
            value: 1
        },
        normalOffset: {
            type: "f",
            value: 0
        },
        squashFactor: {
            type: "f",
            value: .98
        },
        distanceOffset: {
            type: "f",
            value: 0
        },
        geometryFactor: {
            type: "f",
            value: .28
        },
        Absorbption: {
            type: "v3",
            value: new THREE.Vector3(0, 0, 0)
        },
        colorCorrection: {
            type: "v3",
            value: new THREE.Vector3(1, 1, 1)
        },
        boostFactors: {
            type: "v3",
            value: new THREE.Vector3(.892, .892, .98595025)
        },
        centreOffset: {
            type: "v3",
            value: new THREE.Vector3(0, 0, 0)
        }
    },
    side: THREE.DoubleSide
};

export const diamondMaterial = new THREE.ShaderMaterial(DiamondShader)
