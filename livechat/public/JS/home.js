$(document).ready(function(){

    $.post("/getsal",function(data){
        let disalas=document.getElementById('salas');
        let salas= "";
        for(let i=0;i<data.length;i++){
            salas+=`
            <button class='w-100 btn btn-lg btn-dark' type='button' id='${data[i].idgrp}'>${data[i].nombre_sala}</button>`;
        }
        disalas.innerHTML=salas;

        console.log(data);

    });

    let btn=document.getElementById('agr');
    btn.addEventListener('click',()=>{
        var nombresal = prompt('Nombre de la sala');
        $.post("/addroom",{name:nombresal}, function(data){

        })
        console.log(nombresal);
    })
});

/*li.sidebar-item
          a.sidebar-link
            i.align-middle(data-feather='message-square')
            span.align-middle Sala 3 */ 