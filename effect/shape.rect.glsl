/* Shape 2D rect */
float sRect(in vec2 p,in vec2 w){
    float d=max(abs(p.x/w.x),abs(p.y/w.y))*2.;
    float m=max(w.x,w.y);
    return d*m-m;
}
float rect(in vec2 p,in vec2 w){
    float d=sRect(p,w);
    return fill(d);
}
float rect(in vec2 p,in vec2 w,in float t){
    float d=sRect(p,w);
    return stroke(d,t);
}