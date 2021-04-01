/* Shape 2D segment */
float sSegment(in vec2 a,in vec2 b){
    vec2 ba=a-b;
    float d=clamp(dot(a,ba)/dot(ba,ba),0.,1.);
    return length(a-ba*d)*2.;
}
float segment(in vec2 a,in vec2 b,float t){
    float d=sSegment(a,b);
    return stroke(d,t);
}