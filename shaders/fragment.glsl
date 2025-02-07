uniform float uTime;
uniform float uColorChange;
varying vec2 vUv;
varying float vElevation;

// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


void main() {

    //pink
    vec4 color1 = vec4(1.0, 0.68, 0.92, 1.0);
    vec4 color2 = vec4(1.0, 0.7608, 0.9529, 1.0);

    //yellow
    // vec4 color1 = vec4(1.0, 0.851, 0.6902, 1.0);
    // vec4 color2 = vec4(1.0, 0.9059, 0.7922, 1.0);

    //sir
    vec4 color3 = vec4(1.0, 0.9216, 0.8588, 1.0);
    vec4 color4 = vec4(1.0, 0.9686, 0.9451, 1.0);

    float v = smoothstep(.1 ,1. , vElevation*6.75);

    vec4 colorPink = mix(color1,color2,v)  - fbm(vUv*.125); 
    vec4 colorYellow = mix(color3,color4,v)  - fbm(vUv*.125); 

    vec4 colorFinal = mix(colorPink , colorYellow , uColorChange);

    gl_FragColor = colorFinal;
}
