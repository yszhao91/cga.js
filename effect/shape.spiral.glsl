/* Shape 2D spiral */
/* Spiral function by Patricio Gonzalez Vivo */
float sSpiral(in vec2 p,in float turns){
    float r=dot(p,p);
    float a=atan(p.y,p.x);
    float d=abs(sin(fract(log(r)*(turns/5.)+a*.159)));
    return d-.5;
}
float spiral(in vec2 p,in float turns){
    float d=sSpiral(p,turns);
    return fill(d);
}