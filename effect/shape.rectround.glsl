
/* Shape 2D roundrect */
float sRoundrect(in vec2 p,in vec2 w,in float corner){
    vec2 d=abs(p)-w*.5+corner;
    return(min(max(d.x,d.y),0.)+length(max(d,0.))-corner)*2.;
}
float roundrect(in vec2 p,in vec2 w,in float corner){
    float d=sRoundrect(p,w,corner);
    return fill(d);
}
float roundrect(in vec2 p,in vec2 w,in float corner,in float t){
    float d=sRoundrect(p,w,corner);
    return stroke(d,t);
}

