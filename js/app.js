const products = [
 {name:"Oversize",code:"SF-01",category:"Remeras",sizes:"Talles S al XXL",images:["remera.jpeg"]},
 {name:"Oversize",code:"SF-02",category:"Remeras",sizes:"Talles S al XXL",images:["remera2.jpeg"]},
 {name:"Oversize",code:"SF-03",category:"Remeras",sizes:"Talles S al XXL",images:["remera3.jpeg"]},
 {name:"Oversize",code:"SF-04",category:"Remeras",sizes:"Talles S al XXL",images:["remera4.jpeg"]},
 {name:"Oversize",code:"SF-05",category:"Remeras",sizes:"Talles S al XXL",images:["remera5.jpeg"]},
 {name:"Bermuda Mom Con Tira",code:"SF-06",category:"Pantalones y shorts",sizes:"Talles S al XXL",images:["short.jpeg"]},
 {name:"Conjunto deportivo",code:"SF-07",category:"Conjuntos",sizes:"Consultar talles disponibles",images:["nuevoingreso.png","nuevoingreso2.png","nuevoingreso3.png","nuevoingreso4.png"]},
 {name:"Ojotas importadas",code:"SF-08",category:"Ojotas",sizes:"Talles 37 al 44",images:["ojotas.png","ojotas2.png"]},
 {name:"Short NBA / Calidad Premium",code:"SF-09",category:"Pantalones y shorts",sizes:"Consultar talles disponibles",images:["short3.jpeg","short4.jpeg","short5.jpeg","short6.jpeg"]},
 {name:"Zapatillas P180 ⚡️",code:"SF-10",category:"Zapatillas",sizes:"Talles 38 al 43.5",images:["zapatillas7.png"]},
 {name:"NK Air JRDn Low",code:"SF-11",category:"Zapatillas",sizes:"Talles 38 al 44",images:["zapatillas3.png"]},
 {name:"Zapatillas VANS HYLANE",code:"SF-12",category:"Zapatillas",sizes:"Talles 38 al 44",images:["zapatillas4.png"]},
 {name:"Zapatillas Jordan RM4",code:"SF-13",category:"Zapatillas",sizes:"Talles 38 al 44",images:["zapatillas.png","zapatillas2.png","zapatillas5.png"]},
 {name:"Zapatillas V - A - N - S",code:"SF-14",category:"Zapatillas",sizes:"Talles 38 al 43",images:["zapatillas6.png"]},
 {name:"Ojotas Importadas N K",code:"SF-15",category:"Ojotas",sizes:"Talles 38 al 44",images:["ojotas3.png"]},
 {name:"Pantalones de Gabardina Rectos",code:"SF-16",category:"Pantalones y shorts",sizes:"Consultar talles disponibles",images:["pantalon.png","pantalon2.png"]},
 {name:"Pantalones de Gabardina",code:"SF-17",category:"Pantalones y shorts",sizes:"Consultar talles disponibles",images:["pantalon3.png","pantalon4.png"]},
 {name:"Relojes",code:"SF-18",category:"Accesorios",sizes:"Modelos disponibles por consulta",images:["relojes.jpg","relojjpeg.jpeg"]},
 {name:"Gorras",code:"SF-19",category:"Accesorios",sizes:"Modelos disponibles por consulta",images:["gorras.jpeg","gorra2.png","gorra3.png"]}
];
const grid=document.getElementById("productGrid");
const template=document.getElementById("productTemplate");
const search=document.getElementById("productSearch");
const count=document.getElementById("resultCount");
const empty=document.getElementById("emptyState");
let activeCategory="Todos";
const WHATSAPP_NUMBER="5493434680372"; // Pablo: pedidos del carrito y consultas por envíos.
let cart=[];
const asset=name=>"ropa%20fotos/"+encodeURIComponent(name);

function setupCart(){
 if(document.getElementById("cartPanel"))return;
 const layer=document.createElement("div");
 layer.innerHTML=`<div class="cart-overlay" id="cartOverlay"></div><aside class="cart-panel" id="cartPanel" aria-label="Carrito de compras" aria-hidden="true"><div class="cart-header"><div><p class="eyebrow">STILO FACHA · TU SELECCIÓN</p><h2>Mi carrito <span id="cartCountPanel">0</span></h2></div><button class="close-cart" id="closeCart" type="button" aria-label="Cerrar carrito">×</button></div><div class="cart-items" id="cartItems"><p class="cart-empty">Todavía no agregaste productos.</p></div><div class="cart-footer"><p class="cart-note">Los precios, talles y disponibilidad se confirman por WhatsApp.</p><button class="checkout" id="checkoutWhatsApp" type="button">ENVIAR PEDIDO POR WHATSAPP ↗</button></div></aside>`;
 document.body.appendChild(layer);
 document.getElementById("cartBtn").addEventListener("click",openCart);
 document.getElementById("closeCart").addEventListener("click",closeCart);
 document.getElementById("cartOverlay").addEventListener("click",closeCart);
 document.getElementById("checkoutWhatsApp").addEventListener("click",sendCartWhatsApp);
 document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart()});
 updateCart();
}
function addProductToCart(product){
 const cartName=product.code?product.name+" · "+product.code:product.name;
 const found=cart.find(item=>item.name===cartName);
 if(found)found.quantity++;
 else cart.push({name:product.code?product.name+" · "+product.code:product.name,category:product.category,sizes:product.sizes,image:product.images[0],quantity:1});
 updateCart();
}
function updateCart(){
 const total=cart.reduce((sum,item)=>sum+item.quantity,0);
 const badge=document.getElementById("cartCount");if(badge)badge.textContent=total;
 const panelBadge=document.getElementById("cartCountPanel");if(panelBadge)panelBadge.textContent=total;
 const list=document.getElementById("cartItems");if(!list)return;
 list.replaceChildren();
 if(!cart.length){const emptyMsg=document.createElement("p");emptyMsg.className="cart-empty";emptyMsg.textContent="Todavía no agregaste productos.";list.appendChild(emptyMsg);return;}
 cart.forEach((item,index)=>{
  const row=document.createElement("article");row.className="cart-item";
  const photo=document.createElement("img");photo.className="cart-item-photo";photo.src=asset(item.image);photo.alt=item.name;
  const info=document.createElement("div");info.className="cart-item-info";
  const name=document.createElement("h3");name.textContent=item.name;
  const category=document.createElement("p");category.textContent=item.category+" · "+item.sizes;
  const quantity=document.createElement("div");quantity.className="cart-quantity";
  const minus=document.createElement("button");minus.type="button";minus.textContent="−";minus.setAttribute("aria-label","Restar una unidad");
  const amount=document.createElement("span");amount.textContent=item.quantity;
  const plus=document.createElement("button");plus.type="button";plus.textContent="+";plus.setAttribute("aria-label","Agregar una unidad más");
  minus.addEventListener("click",()=>{item.quantity--;if(item.quantity<=0)cart.splice(index,1);updateCart()});
  plus.addEventListener("click",()=>{item.quantity++;updateCart()});
  quantity.append(minus,amount,plus);info.append(name,category,quantity);
  const remove=document.createElement("button");remove.type="button";remove.className="cart-remove";remove.textContent="Quitar";remove.addEventListener("click",()=>{cart.splice(index,1);updateCart()});
  row.append(photo,info,remove);list.appendChild(row);
 });
}
function openCart(){setupCart();document.getElementById("cartPanel").classList.add("open");document.getElementById("cartOverlay").classList.add("open");document.getElementById("cartPanel").setAttribute("aria-hidden","false")}
function closeCart(){const panel=document.getElementById("cartPanel"),overlay=document.getElementById("cartOverlay");if(panel){panel.classList.remove("open");panel.setAttribute("aria-hidden","true")}if(overlay)overlay.classList.remove("open")}
function sendCartWhatsApp(){
 if(!cart.length){showContactNotice("Primero agregá algún producto al carrito");return;}
 if(!WHATSAPP_NUMBER){showContactNotice("Falta configurar el WhatsApp oficial del local");return;}
 const lines=cart.map(item=>`• ${item.name} — Cantidad: ${item.quantity} (${item.sizes})`);
 const message="Hola, Stilo Facha! Quiero consultar por estos productos:\n\n"+lines.join("\n")+"\n\n¿Me confirman precios, colores, talles y disponibilidad?";
 window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
}

function renderProducts(){
 const term=search.value.trim().toLocaleLowerCase("es");
 const filtered=products.filter(p=>(activeCategory==="Todos"||p.category===activeCategory)&&(p.name+" "+(p.code||"")+" "+p.category+" "+p.sizes).toLocaleLowerCase("es").includes(term));
 grid.replaceChildren();
 filtered.forEach(product=>{
  const node=template.content.firstElementChild.cloneNode(true);
  const img=node.querySelector(".product-image");
  img.src=asset(product.images[0]);img.alt=product.name;
  img.addEventListener("error",()=>{img.alt="Foto no disponible: "+product.name;img.classList.add("image-missing");},{once:true});
  node.querySelector(".product-category").textContent=product.category;
  node.querySelector("h3").textContent=product.name;
  node.querySelector(".product-index").textContent=product.code||String(products.indexOf(product)+1).padStart(2,"0");
  if(product.code)node.querySelector(".product-index").classList.add("product-code");
  node.querySelector(".product-sizes").textContent=product.sizes;
  const openDetails=()=>openProductModal(product);
  node.querySelector(".quick-view").addEventListener("click",openDetails);
  node.querySelector(".product-consult").textContent="AGREGAR AL CARRITO +";
  node.querySelector(".product-consult").addEventListener("click",()=>{addProductToCart(product);showContactNotice(product.name+" agregado al carrito")});
  img.addEventListener("click",openDetails);
  img.style.cursor="zoom-in";
  grid.appendChild(node);
 });
 count.textContent=filtered.length+" PRODUCTO"+(filtered.length===1?"":"S");
 empty.hidden=filtered.length!==0;
}
function openProductModal(product){
 let modal=document.getElementById("productModal");
 if(!modal){
  modal=document.createElement("div");
  modal.id="productModal";modal.className="product-modal";modal.hidden=true;
  modal.innerHTML=`<div class="product-modal-backdrop" data-close="true"></div><section class="product-modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalProductName"><button class="product-modal-close" type="button" aria-label="Cerrar ventana">×</button><div class="product-modal-gallery"><div class="product-modal-carousel"><div class="product-modal-peek-frame product-modal-peek-frame-prev"><img class="product-modal-peek product-modal-peek-prev" alt="" aria-hidden="true"></div><div class="product-modal-main-frame"><img class="product-modal-main-image" alt=""></div><div class="product-modal-peek-frame product-modal-peek-frame-next"><img class="product-modal-peek product-modal-peek-next" alt="" aria-hidden="true"></div><button class="product-modal-arrow product-modal-prev" type="button" aria-label="Foto anterior">‹</button><button class="product-modal-arrow product-modal-next" type="button" aria-label="Foto siguiente">›</button><span class="product-modal-counter" aria-live="polite"></span></div><div class="product-modal-thumbnails"></div></div><div class="product-modal-details"><p class="product-modal-kicker">STILO FACHA · CATÁLOGO</p><h2 id="modalProductName"></h2><p class="product-modal-code"></p><p class="product-modal-category"></p><p class="product-modal-sizes"></p><p class="product-modal-note">Consultá por disponibilidad, colores y talles en el local.</p><button class="product-modal-contact" type="button">CONSULTAR ESTE PRODUCTO ↗</button></div></section>`;
  document.body.appendChild(modal);
  modal.querySelector(".product-modal-close").addEventListener("click",()=>{modal.hidden=true;document.body.classList.remove("modal-open")});
  modal.querySelector(".product-modal-backdrop").addEventListener("click",()=>{modal.hidden=true;document.body.classList.remove("modal-open")});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!modal.hidden){modal.hidden=true;document.body.classList.remove("modal-open")}});
 }
 const remeraModels=product.category==="Remeras"?products.filter(item=>item.category==="Remeras"):null;
 const galleryProducts=remeraModels&&remeraModels.length>1?remeraModels:(product.images.length>1?product.images.map((image)=>Object.assign({},product,{images:[image]})):[product]);
 let selectedProduct=product;
 const addFromModal=modal.querySelector(".product-modal-contact");
 addFromModal.textContent="AGREGAR AL CARRITO +";
 addFromModal.onclick=()=>{addProductToCart(selectedProduct);modal.hidden=true;document.body.classList.remove("modal-open");showContactNotice(selectedProduct.name+" agregado al carrito")};
 const main=modal.querySelector(".product-modal-main-image");
 const peekPrev=modal.querySelector(".product-modal-peek-prev");
 const peekNext=modal.querySelector(".product-modal-peek-next");
 const thumbs=modal.querySelector(".product-modal-thumbnails");
 const counter=modal.querySelector(".product-modal-counter");
 const prev=modal.querySelector(".product-modal-prev");
 const next=modal.querySelector(".product-modal-next");
 let currentIndex=Math.max(0,galleryProducts.indexOf(product));
 const showImage=index=>{
  currentIndex=(index+galleryProducts.length)%galleryProducts.length;
  selectedProduct=galleryProducts[currentIndex];
  main.src=asset(selectedProduct.images[0]);main.alt=selectedProduct.name;
  peekPrev.src=asset(galleryProducts[(currentIndex-1+galleryProducts.length)%galleryProducts.length].images[0]);
  peekNext.src=asset(galleryProducts[(currentIndex+1)%galleryProducts.length].images[0]);
  peekPrev.hidden=peekNext.hidden=galleryProducts.length<2;
  counter.textContent=(currentIndex+1)+" / "+galleryProducts.length;
  modal.querySelector("#modalProductName").textContent=selectedProduct.name;
  const codeLabel=modal.querySelector(".product-modal-code");
  codeLabel.textContent=selectedProduct.code||"";codeLabel.hidden=!selectedProduct.code;
  modal.querySelector(".product-modal-category").textContent=selectedProduct.category;
  modal.querySelector(".product-modal-sizes").textContent=selectedProduct.sizes;
  thumbs.querySelectorAll("button").forEach((item,i)=>item.classList.toggle("active",i===currentIndex));
  prev.hidden=next.hidden=galleryProducts.length<2;
 };
 prev.onclick=()=>showImage(currentIndex-1);
 next.onclick=()=>showImage(currentIndex+1);
 thumbs.replaceChildren();
 galleryProducts.forEach((galleryProduct,index)=>{
  const button=document.createElement("button");button.type="button";button.className="product-modal-thumb";button.setAttribute("aria-label","Ver modelo "+(index+1));
  const image=document.createElement("img");image.src=asset(galleryProduct.images[0]);image.alt="";
  button.appendChild(image);button.addEventListener("click",()=>showImage(index));
  thumbs.appendChild(button);
 });
 const carousel=modal.querySelector(".product-modal-carousel");
 let touchStartX=0;
 carousel.ontouchstart=event=>{touchStartX=event.changedTouches[0].clientX};
 carousel.ontouchend=event=>{const delta=event.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>45)showImage(currentIndex+(delta<0?1:-1))};
 showImage(currentIndex);
 modal.hidden=false;document.body.classList.add("modal-open");
 modal.querySelector(".product-modal-close").focus();
}
function showContactNotice(name){
 let note=document.getElementById("contactNotice");
 if(!note){note=document.createElement("div");note.id="contactNotice";note.className="contact-notice";note.setAttribute("role","status");document.body.appendChild(note);}
 note.textContent=name; 
 note.classList.add("show");
 window.clearTimeout(showContactNotice.timer);
 showContactNotice.timer=window.setTimeout(()=>note.classList.remove("show"),4200);
}
document.getElementById("filterList").addEventListener("click",event=>{
 const button=event.target.closest("button[data-category]");
 if(!button)return;
 activeCategory=button.dataset.category;
 document.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));
 renderProducts();
});
search.addEventListener("input",renderProducts);
const menuToggle=document.getElementById("menuToggle");
const nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));
document.getElementById("whatsappLink").addEventListener("click",event=>{event.preventDefault();if(cart.length){openCart()}else if(WHATSAPP_NUMBER){window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent("Hola, Stilo Facha! Quería hacer una consulta por productos."),"_blank","noopener,noreferrer")}else{showContactNotice("Falta configurar el WhatsApp oficial del local")}});
document.getElementById("shippingWhatsappLink").addEventListener("click",event=>{if(WHATSAPP_NUMBER){event.preventDefault();window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent("Hola, Stilo Facha! Quería consultar por los envíos a mi localidad."),"_blank","noopener,noreferrer")}});

function setupHeroPhotoCarousel(){
 const carousel=document.getElementById("heroPhotoCarousel");
 const track=document.getElementById("heroPhotoTrack");
 if(!carousel||!track||track.children.length<2)return;
 let current=0;let timer;
 const show=index=>{current=index%2;track.style.transform="translateX(-"+(current*50)+"%)";carousel.classList.toggle("is-first",current===0);carousel.classList.toggle("is-second",current===1)};
 const stop=()=>window.clearInterval(timer);
 const start=()=>{stop();if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)timer=window.setInterval(()=>show(current+1),5200)};
 carousel.addEventListener("mouseenter",stop);carousel.addEventListener("mouseleave",start);
 carousel.addEventListener("focusin",stop);carousel.addEventListener("focusout",start);
 document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
 show(0);start();
}
setupHeroPhotoCarousel();
function setupLooksCarousel(){
 const track=document.getElementById("looksTrack");
 const carousel=document.getElementById("looksCarousel");
 const counter=document.getElementById("looksCounter");
 const dots=[...document.querySelectorAll("#looksDots button")];
 if(!track||!carousel||!counter||!dots.length)return;
 const total=track.children.length;
 let current=0;
 let timer;
 const show=index=>{
  current=(index+total)%total;
  track.style.transform="translateX(-"+(current*100)+"%)";
  counter.textContent=String(current+1).padStart(2,"0")+" / "+String(total).padStart(2,"0");
  dots.forEach((dot,i)=>{dot.classList.toggle("active",i===current);dot.setAttribute("aria-current",i===current?"true":"false")});
 };
 const stop=()=>window.clearInterval(timer);
 const start=()=>{stop();if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)timer=window.setInterval(()=>show(current+1),5200)};
 document.getElementById("looksPrev").addEventListener("click",()=>{show(current-1);start()});
 document.getElementById("looksNext").addEventListener("click",()=>{show(current+1);start()});
 dots.forEach((dot,i)=>dot.addEventListener("click",()=>{show(i);start()}));
 carousel.addEventListener("mouseenter",stop);
 carousel.addEventListener("mouseleave",start);
 carousel.addEventListener("focusin",stop);
 carousel.addEventListener("focusout",start);
 let touchX=0;
 carousel.addEventListener("touchstart",event=>{touchX=event.changedTouches[0].clientX;stop()},{passive:true});
 carousel.addEventListener("touchend",event=>{const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>40)show(current+(delta<0?1:-1));start()},{passive:true});
 document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
 show(0);start();
}
setupLooksCarousel();
setupCart();
renderProducts();
