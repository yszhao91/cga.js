/* Shape 2D poly */
float sPoly(in vec2 p,in float w,in int sides){
    float a=atan(p.x,p.y)+PI;
    float r=TWO_PI/float(sides);
    float d=cos(floor(.5+a/r)*r-a)*length(max(abs(p)*1.,0.));
    return d*2.-w;
}
float poly(in vec2 p,in float w,in int sides){
    float d=sPoly(p,w,sides);
    return fill(d);
}
float poly(in vec2 p,in float w,in int sides,in float t){
    float d=sPoly(p,w,sides);
    return stroke(d,t);
}
