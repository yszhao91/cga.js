/* Shape 2D line */
float sLine(in vec2 a,in vec2 b){
    vec2 p=b-a;
    float d=abs(dot(normalize(vec2(p.y,-p.x)),a));
    return d*2.;
}
float line(in vec2 a,in vec2 b){
    float d=sLine(a,b);
    return fill(d);
}
float line(in vec2 a,in vec2 b,in float t){
    float d=sLine(a,b);
    return stroke(d,t);
}
float line(in vec2 p,in float a,in float t){
    vec2 b=p+vec2(sin(a),cos(a));
    return line(p,b,t);
}