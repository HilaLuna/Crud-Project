//html elementleri
const form = document.querySelector(".grocery-form")
const alert = document.querySelector(".alert")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")

//Düzenleme Seçenekleri
let editElement //düzenleme yapılan öğeyi temsil eder
let editFlag = false //düzenleme modunda olup olmadığını belirtir
let editID = "" //benzersiz id

//form gönderildiğinde addItem fonksiyonunu çağır
form.addEventListener("submit", addItem)

//Temizle düğmesine tıklandığında clearItems fonksiyonunu çağır.
clearBtn.addEventListener("click",clearItems)
//sayfa yüklendiğinde setupItems fonksiyonunu çağır
//window.addEventListener("DOMContentLoaded", setupItems) //!konsolda hata verdi

//! functions
function addItem(e){
    e.preventDefault() //submite tıkladığımızda sürekli sayfayı yenilemesin diye
    const value = grocery.value //inputun giriş değerini al
    const id = new Date().getTime().toString()
    
    if(value !== "" && !editFlag){ //eğer içi boş değilse anlamına geliyor    
        const element = document.createElement("article") //js'de yeni bir html öğresi oluştururken kullanıyoruz
        let attr = document.createAttribute("data-id") //yeni bir veri kimliği oluşturur js'te
        attr.value = id
        element.setAttributeNode(attr) /*yukarda oluşturduğumuz attribute yani özelliği yeni 
        oluşturduğumuz html elementine aktarırken setAttribute kullanıyoruz.*/
        element.classList.add("grocery-item") //js'de bir elemente class eklerken classList kullanıyoruz
        //console.log(element)

        /*Oluşturduğumuz article'ın içini değiştirmek için innerHtml kullanıyoruz */
        element.innerHTML = `
            <p class="title">${value}</p>
             <div class="btn-container">
                <button class="edit-btn" type="button">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete-btn" type="button">
                    <i class="fa-solid fa-trash"></i></button>
             </div>
        `

        const deleteBtn = element.querySelector(".delete-btn")
        deleteBtn.addEventListener("click",deleteItem)

        const editBtn = element.querySelector(".edit-btn")
        //console.log(editBtn)
        editBtn.addEventListener("click", editItem)


        list.appendChild(element) /*item'ı placeholdera bir şey yazıp submit deyince aşağı kısımda
         görüyoruz. Yani appendChild ile oluşturduğumuz html etiketini gönderdik.*/
         // alert
         displayAlert("Başarıyla Eklendi", "success")//success deyince Başarıyla eklendi yazısı yeşil kutunun içinde gözüküyor.
        //show container
         container.classList.add("show-container")
         // localStorage'a ekleme
         addToLocalStorage(id, value)
         //içeriği temizleme
         setBackToDefault()
    } else if(value !== "" && editFlag){
        editElement.innerHTML = value /*Bununla kutucuğa eller girdiğimiz item, daha önce girdiklerimizden birini değiştiriyor. */
        displayAlert("Value changed", "success") /*Burda da girdiğimiz bir item'ın yanındaki yeşil Tick'e bastığımızda o item'ın
        değerini değiştiriyor. Yukarı yeşille value changed yazdırıyoruz. */
        editLocalStorage(editID, value)
        setBackToDefault() /*Burda da item'ı edit yapmak istediğimizde value changed yapıyo ama
        tekrar kutucuğu eski boş haline yani sadece "İhtiyaçlarınızı giriniz" olan hale getiriyor(yani inputun içindeki değeri sıfırlamış olduk)
        ve edit butonunu da submite dönüştürüyor. */
    }else{
        displayAlert("Please enter a value", "danger") /*İnputa hiçbir değer girmeden submite tıklarsan, kırmızı kutucuğun içinde Lütfen bir değer giriniz ibaresi çıkması için.  */
    } /*Yani yukarıdaki 3 if, else if ve else'li kısım da yaptığın işleme göre çalışıyor. */
}

//alert fonksiyonu
function displayAlert(text,action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`) 
    console.log(alert)
    setTimeout(function(){
        alert.textContent=""
        alert.classList.remove(`alert-${action}`)
    },2000)
}

// temizleme
function setBackToDefault(){ //placeholder'a yazdığın şey gidiyor, defaultta ne yazdıysan o gözüküyor
    grocery.value ="" //kutuya bir şey yazdığımızda submit deyince içi tekrardan boşalsın anlamında
    editFlag=false //edit kutucuğu en başta gözükmesin
    editID=""
    submitBtn.textContent = "submit" //edit geldikten sonra tekrar tıkladığımızda submit butonu gelsin anlamında.
}

//silme işlemi
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement /*Alışveriş listesine yazdığımız itemların
    bir üst kapsayıcısını parentElement ile bulduk. Onun bir üst kapsayıcısına ise yine bir parentElement
    daha yazarak ulaştık. Current target yazmamızın sebebi ise tekrar bir parentElement daha yazmak zorunda kalmamak. */
    //console.log(element)
    const id = element.dataset.id /*alışveriş listesine yazdığımız item'ın datasetine ve id'sine ulaşmış olduk. 
    Bunu yapmamızın nedeni localStorage'da bu id ile silicez elementi. Yukarda appendChild ile elementi eklemiştik, kaldırmak
    istediğimizde ise yani herhangi bir html etiketini kaldırmak istediğimizde de removeChild kullanıcaz. */
    list.removeChild(element) /*bununla alışveriş listesine girdiğimiz item için çöp kutusuna bastığımızda siliyor direkt.
    ama "Listeyi temizle" yazısı gitmiyor. Onu da aşağıdaki gibi yapıcaz. Yani grocery list'in içindeki child elementlerine 
    ulaşmaya çalışıcaz. Yukarıda nasıl parentElement ile ana kapsayıcılarına ulaştıysak, bu defa da çocuk elementlere. */
   //!console.log(list.children) 
    if(list.children.length == 0){
        container.classList.remove("show-container")
    } /* Burda yaptığımız şey alışveriş listesine item'lar ekledikten sonra çöp kutusuna tek tek basıp
    sildiğimizde siliniyor ama Listeyi temizle ibaresi kalıyor. En son item'ı da sildiğimizde bu defa
    Listeyi Temizle ibaresi de kalkmış oluyor. */
    displayAlert("Item removed", "danger") /*Burda yaptığımız ise, alışveriş listesine item'ları girdiğimizde 
    silince yukarıda kırmızı kutu içinde (dangerin verdiği efekt) Item Removed yazdırmış oluyoruz. */

    removeFromLocalStorage(id)
}
//düzenleme fonksiyonu
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling /*Burda sibling kullanarak index.html'deki
    p etiketine ulaşmış olduk. */
    //!console.log(editElement)
    //form değeri düzenlenen öğenin metniyle doldur.
    grocery.value = editElement.innerHTML /*Bununla alışveriş listesine item eklediğimizde, eğer tick olan
    kısma tıklarsak, o eklediğimiz item kutucuğun içinde görünüyor, yani inner html kısmında. */
    editFlag = true
    editID = element.dataset.id //düzenlenen elementin kimliği
    submitBtn.textContent = "edit" /*Burda alışveriş listesine item girip submite tıkladığımızda sonra tekrar yeşil
    tick'e tıkladığımızda submit butonu edit butonuna dönüşüyor. */
}

//listeyi temizleme
function clearItems(){
    const items = document.querySelectorAll(".grocery-item")
    //!console.log(items)
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item) /*Listeyi temizle'ye tıklayınca tüm item'lar kalktı. */
        })
    }
    container.classList.remove("show-container") /*Bununla da Listeyi Temizle yazısını kaldırmış olduk. */
    displayAlert("Liste temizlendi", "danger") /*Item ekleyip submit dedikten sonra yukarda çıkan alert yazısının gitmesini bekleyip Listeyi temizle'ye tıklarsak Liste Temizlendi yazısı çıkıyor. */
    setBackToDefault() /*input kutucuğunun içinde hiçbir şey bırakmıyor, default yazısı hariç.*/

}
//! localStorage işlemleri
//yerel depoya öğe ekleme işlemi
function addToLocalStorage(id,value){
    const grocery = {id,value}
    let items = getLocalStorage()
    items.push(grocery)     
    localStorage.setItem("list",JSON.stringify(items)) /*Burda items'ı localStorage'a aktarmak için JSON stringify metodunu kullandık. */
}
// localStorage'dan verileri alma işlemi
function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) 
    : [] 
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage()

    items = items.filter(function(item){
        if (item.id !==id){
            return item
        }
    })
}

function editLocalStorage(id,value){
    // console.log(id,value)
}

// function setupItems(){
//     let items = getLocalStorage()
// }