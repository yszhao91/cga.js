
//点到点的距离
float dss(vec3 p0,vec3 p1){
  vec3 d=p1-p0;
  return d.x*d.x+d.y*d.y+d.z*d.z;
}

//点到线段的距离
float dssps(vec3 p,vec3 sp0,vec3 sp1,out int isdawn){
  vec3 diff=p-sp1;
  vec3 extDir=sp1-sp0;
  float t=dot(extDir,diff);
  vec3 c;
  if(t>=0.){
    isdawn=1;
    c=sp1;
  }else{
    diff=p-sp0;
    t=dot(extDir,diff);
    if(t<=0.){
      isdawn=0;
      c=sp0;
    }
    else{
      isdawn=2;
      float sqrLength=dss(sp0,sp1);
      if(sqrLength<=0.)
      sqrLength=0.;
      
      t/=sqrLength;
      c=extDir*t+sp0;
      diff=p-c;
    }
  }
  
  return length(diff);
}

//点到路径的距离
float dsspss(vec3 p,in vec3 segs[100],out bool isdawn){
  float threshold=-99.;
  float u=100.;
  if(segs[1].y<threshold)
  return u;
  
  int ipos;
  for(int i=0;i<100;i++){
    vec3 pti=segs[i];
    if(pti.y<threshold)
    break;
    
    vec3 ptj=segs[i+1];
    
    if(abs(pti.x-p.x)>u&&abs(ptj.x-p.x)>u&&(pti.x-p.x)*(ptj.x-p.x)>0.)
    continue;
    if(abs(pti.y-p.y)>u&&abs(ptj.y-p.y)>u&&(pti.y-p.y)*(ptj.y-p.y)>0.)
    continue;
    if(abs(pti.z-p.z)>u&&abs(ptj.z-p.z)>u&&(pti.z-p.z)*(ptj.z-p.z)>0.)
    continue;
    
    int onedawn=2;//非端点 0是前端点，1是后端点
    float distance=dssps(p,pti,ptj,onedawn);
    bool end=false;
    if(segs[i+1].y<threshold)
    end=true;
    //if((i == 0 && onedawn ==0)||(i ==0 && onedawn == 1))
    if((i==0&&onedawn==0)||(end&&onedawn==1))
    isdawn=true;
    if(distance<u){
      u=distance;
      ipos=i;
    }
  }
  
  return u;
}

/* Boolean functions */
float sUnion(float a,float b){
  return min(a,b);
}
float sIntersect(float a,float b){
  return max(a,b);
}
float sDifference(float a,float b){
  return max(a,-b);
}