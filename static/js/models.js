App.Models.Note = Backbone.Model.extend({
    defaults : {
        title : '',
        content : '',
    },

    localStorage : store,

    initialize : function() {
        // console.log(this.get('title'));
        // console.log(this.get('content'));
    },
}); 