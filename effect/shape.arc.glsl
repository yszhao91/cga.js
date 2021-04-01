/* Shape 2D arc */
float sArc(in vec2 p,in float w,in float s,in float e){
    float a=distance(p,w*.5*vec2(cos(s),sin(s)));
    float x=-PI;
    p*=mat2(cos(x-s),-sin(x-s),sin(x-s),cos(x-s));
    float b=clamp(atan(p.y,p.x),x,x+e);
    b=distance(p,w*.5*vec2(cos(b),sin(b)));
    return min(a,b)*2.;
}
float arc(in vec2 p,in float w,in float s,in float e,in float t){
    float d=sArc(p,w,s,e);
    return stroke(d,t);
}