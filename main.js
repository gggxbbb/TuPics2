class Sort {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Pic {
    constructor(id, title, sortId, content, themeColor, textColor, path, date, username, width, height) {
        this.id = id;
        this.title = title;
        this.sortId = sortId;
        this.content = content;
        this.themeColor = themeColor;
        this.textColor = textColor;
        this.path = path;
        this.date = date;
        this.username = username;
        this.width = width;
        this.height = height;
    }
}

class DataLoader {

    database_buffer = null;
    database_loaded = false;

    /** Get all the data from the SQLite3 database
     * @param callback - The callback function to be called after getting the data, with the parameters sorts and pics
     * @param failureCallback
     * @returns {void}
     */
    getData(
        callback = (sorts, pics) => {
        },
        failureCallback = () => {
            console.error('Failed to load SQLite3 database');
        }
    ) {

        let pThis = this;

        // noinspection JSUnusedGlobalSymbols
        initSqlJs(
            {
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
            }
        ).then(function (SQL) {
            /*
            download SQLite3 from https://file.gxb.pub/d/local/tu/tu.sqlite3 then load it using sql.js

            # Table Sort
            ## ID(UUID), Name
            # Table Pics
            ## ID(UUID), Title, SortID, Content, ThemeColor, TextColor, Path, Date, Username, Width, Height
            */

            function load(buffer) {

                document.getElementById("loading_state").innerHTML = "处理数据中";

                try {
                    const db = new SQL.Database(buffer);

                    const sorts = [];
                    const pics = [];

                    db.each('SELECT * FROM Sort', function (row) {
                        sorts.push(new Sort(row.ID, row.Name));
                    });
                    db.each('SELECT * FROM Pics', function (row) {
                        pics.push(new Pic(row.ID, row.Title, row.SortID, row.Content, row.ThemeColor, row.TextColor, row.Path, row.Date, row.Username, row.Width, row.Height));
                    });

                    db.close();

                    callback(sorts, pics);

                    pThis.database_loaded = true;
                    pThis.database_buffer = buffer;
                } catch (err) {
                    failureCallback();
                }
            }

            if (pThis.database_buffer !== null && pThis.database_buffer !== undefined && pThis.database_buffer.length > 0 && pThis.database_loaded) {
                load(pThis.database_buffer);
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://tu-data.gxb.pub/tu.sqlite3', true);
            xhr.responseType = 'arraybuffer';
            xhr.onloadend = function (e) {

                if (this.status !== 200) {
                    failureCallback();
                    return;
                }

                const uInt8Array = new Uint8Array(this.response);

                pThis.database_buffer = uInt8Array;

                load(uInt8Array);

            };
            xhr.onprogress = function (progress) {
                let percent = Math.floor(progress.loaded / progress.total * 100);
                document.getElementById("loading_progress").innerHTML = "" + percent + "%";
            };
            xhr.onreadystatechange = function (state) {
                switch (this.readyState) {
                    case 0:
                        document.getElementById("loading_state").innerHTML = "初始化中";
                        break;
                    case 1:
                        document.getElementById("loading_state").innerHTML = "准备连接中";
                        break;
                    case 2:
                        document.getElementById("loading_state").innerHTML = "正在连接中";
                        break;
                    case 3:
                        document.getElementById("loading_state").innerHTML = "正在加载中";
                        break;
                    case 4:
                        document.getElementById("loading_state").innerHTML = "加载完成";
                        break;
                }
            }
            xhr.send();
        });
    }
}