function getData_callback(filter) {
    return function (sorts, pics) {

        let float_bar = document.getElementById("extra_toolbar");

        for (let i = 0; i < sorts.length; i++) {
            let sort = sorts[i];
            let div = document.createElement("div");

            let label = document.createElement("h2");
            label.innerHTML = sort.name;
            div.appendChild(label);

            div.id = "sort_" + sort.id;
            document.getElementById("sort_root").appendChild(div);

            let float_button = document.createElement("button");
            float_button.innerHTML = sort.name;
            float_button.onclick = function () {
                //goto target
                let target = document.getElementById("sort_" + sort.id);
                if (target) {
                    target.scrollIntoView();
                }
            }
            float_bar.appendChild(float_button);
        }
        for (let i = 0; i < pics.length; i++) {
            let pic = pics[pics.length - i - 1];

            if (!filterPic(pic, filter)) {
                continue;
            }

            let img_div = document.createElement("div");
            img_div.className = "img_div";
            img_div.id = "pic_" + pic.id;
            //set text color using pic.textColor
            img_div.style.color = pic.textColor;
            //set background color using pic.themeColor
            img_div.style.backgroundColor = pic.themeColor;

            let img_title = document.createElement("h4");
            img_title.innerHTML = pic.title;
            img_title.className = "img_title";
            img_div.appendChild(img_title);

            let img_desc = document.createElement("div");
            // noinspection JSUnresolvedReference
            img_desc.innerHTML = marked.parse(pic.content)
            img_desc.className = "img_desc";
            img_div.appendChild(img_desc);

            let img_info = document.createElement("p");
            img_info.innerHTML = pic.date + " @" + pic.username + " |" + pic.width + "x" + pic.height;
            img_info.className = "img_info";
            img_div.appendChild(img_info);

            let img = document.createElement("img");
            img.className = "img";
            img.loading = "lazy";
            img.src = "https://tu-data.gxb.pub/pictures" + pic.path;
            img_div.appendChild(img);

            //get sort_root
            let sort_root = document.getElementById("sort_" + pic.sortId);
            if (sort_root) {
                sort_root.appendChild(img_div);
                //set img width
                img.style.width = img_div.offsetWidth - 30 + "px";
                //set img height
                img.style.height = (img_div.offsetWidth - 30) / pic.width * pic.height + "px";
            }

            //hide onloading
            document.getElementById("loading").style.display = "none";
        }
    }
}