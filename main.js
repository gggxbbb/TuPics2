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

/** Get all the data from the SQLite3 database
 * @param {function} callback - The callback function to be called after getting the data, with the parameters sorts and pics
 * @returns {void}
 */
function getData(
    callback,
) {
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
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://file.gxb.pub/d/local/tu/tu.sqlite3', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            const uInt8Array = new Uint8Array(this.response);
            const db = new SQL.Database(uInt8Array);

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
        };
        xhr.send();
    });
}