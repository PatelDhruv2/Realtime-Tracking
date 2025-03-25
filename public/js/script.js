const socket=io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;
        socket.emit('sendLocation',{latitude,longitude});
    },(error)=>{
        console.log(error);
    },{
        enableHighAccuracy:true,
        timeout:3000,
        maximumAge:0
    });  
}
const map=L.map("map").setView([0,0],10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"openstreetmap.org"

}).addTo(map);
const markers={};
socket.on('locationMessage',(location)=>{
    const {latitude,longitude,id}=location;
    map.setView([latitude,longitude],10);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
