var store = new Store('嘻嘻');

var tpl = {
    notes_list_tpl : Handlebars.compile($('#notes-list-tpl').html()),
    note_item_tpl : Handlebars.compile($('#note-item-tpl').html()),
    note_detail_tpl : Handlebars.compile($('#note-detail-tpl').html()),
    note_edit_tpl : Handlebars.compile($('#note-edit-tpl').html()),
};

var App = {
    Models: {},
    Collections: {},
    Routers: {},
    Views:{},
    
    init : function(){
        new App.Routers.NoteRouter();
        Backbone.history.start();
    }
}

// App.init();
/*
var router = new NoteRouter({
    $el : $('#main div.container'),
});
Backbone.history.start();*/

/*
 var notes_list = new NotesList();
 var notes_list_view = new NotesListView({
 collection : notes_list,
 });

 $('button[name="new"]').on('click', function() {
 var note_edit_view = new NoteEditView({
 collection : notes_list,
 });
 note_edit_view.render();
 });*/

