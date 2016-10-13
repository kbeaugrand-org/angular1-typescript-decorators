System.register([], function(exports_1) {
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
    exports_1("camelize", camelize);
    return {
        setters:[],
        execute: function() {
        }
    }
});
