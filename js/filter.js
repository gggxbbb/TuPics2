function filterPic(pic, filter) {
    if (filter === null || filter === "") {
        return true;
    }
    let filters = filter.split(" ");

    let re = true

    for (let i = 0; i < filters.length; i++) {
        filter = filters[i];

        if (filter.startsWith("@")) {
            if (pic.username.indexOf(filter.substring(1)) === -1) {
                re = re && false;
            }
        } else if (filter.startsWith("#")) {
            if (pic.date.indexOf(filter.substring(1)) === -1) {
                re = re && false;
            }
        } else if (filter.startsWith("=")) {
            if (filter.startsWith("=@")) {
                let reg = new RegExp(filter.substring(2));
                if (!reg.test(pic.username)) {
                    re = re && false;
                }
            } else if (filter.startsWith("=#")) {
                let reg = new RegExp(filter.substring(2));
                if (!reg.test(pic.date)) {
                    re = re && false;
                }
            } else {
                let reg = new RegExp(filter.substring(1));
                if (!reg.test(pic.title) && !reg.test(pic.content)) {
                    re = re && false;
                }
            }
        } else if (filter.startsWith("\\@") || filter.startsWith("\\#") || filter.startsWith("\\=")) {
            if (pic.title.indexOf(filter.substring(1)) === -1 && pic.content.indexOf(filter.substring(1)) === -1) {
                re = re && false;
            }
        } else {
            if (pic.title.indexOf(filter) === -1 && pic.content.indexOf(filter) === -1) {
                re = re && false;
            }
        }
    }
    return re;
}