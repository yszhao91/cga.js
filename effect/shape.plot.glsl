
/* Shape 2D plot */
float sPlot(vec2 p,float y){
    return p.y+y;
}
float plot(vec2 p,float y,float t){
    float d=sPlot(p,y);
    return 1.-smoothstep(t/2.-rx,t/2.+rx,abs(d));
}

