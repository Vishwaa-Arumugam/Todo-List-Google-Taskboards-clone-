const btn_menu = document.querySelector(".btn-menu");
        const side_bar = document.querySelector(".sidebar");
        const tasks = document.querySelector(".tasks");
        const lists = document.querySelector(".Lists");
  
        btn_menu.addEventListener("click", function () {
          side_bar.classList.toggle("expand");
          if (tasks.style.display === 'none') {
              tasks.style.display = 'block';
              tasks.style.marginLeft = '15px';
          } else {
              tasks.style.display = 'none';
          }
          if (lists.style.display === 'none') {
              lists.style.display = 'block';
              lists.style.marginLeft = '15px';
          } else {
              lists.style.display = 'none';
          }
          changebtn();
        });
  
        function changebtn() {
          if (side_bar.classList.contains("expand")) {
            btn_menu.classList.replace("bx-menu", "bx-menu-alt-right");
          } else {
            btn_menu.classList.replace("bx-menu-alt-right", "bx-menu");
          }
        }