console.log('Loaded!');
//change the txt of the main text div
var element = document.getElementById("main-text");
element.innerHTML= "New Value";
//move the image
var img=document.getElementById("madi");
img.onclick=function(){
  img.style.marginLeft='100px';  
};