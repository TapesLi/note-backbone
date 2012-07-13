var tpl = {
    notes_list_tpl : Handlebars.compile($('#notes-list-tpl').html()),
    note_item_tpl : Handlebars.compile($('#note-item-tpl').html()),
    note_detail_tpl : Handlebars.compile($('#note-detail-tpl').html()),
    note_edit_tpl : Handlebars.compile($('#note-edit-tpl').html()),
};

var Note = Backbone.Model.extend({

    defaults : {
        title : 'Title',
        content : 'content',
    },

    localStorage : new Store('note-backbone'),

    initialize : function() {
        // console.log(this.get('title'));
        // console.log(this.get('content'));
    },
});

var NotesList = Backbone.Collection.extend({

    model : Note,
    localStorage : new Store('note-backbone'),
});

var NoteItemView = Backbone.View.extend({
    tagName : 'li',
    className : 'note-item',
    tpl : tpl.note_item_tpl,

    events : {
        'click button' : 'clear',
    },

    initialize : function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },

    render : function() {
        this.$el.html(this.tpl(this.model.toJSON()));
        return this;
    },

    clear : function() {
        this.model.destroy();
    },
});

var NoteDetailView = Backbone.View.extend({
    id : 'note-detail',
    tpl : tpl.note_detail_tpl,
    initialize : function() {

    },
    render : function() {

    }
});

var NoteEditView = Backbone.View.extend({
    el : $('#note-edit'),
    tpl : tpl.note_edit_tpl,

    events : {
        'click button[name="cancel"]' : 'delete_view',
        'click button[name="save"]' : 'save',
        'click input' : 'select',
        'click textarea' : 'select',
    },

    initialize : function() {

    },

    render : function() {
        this.$el.append(this.tpl());
        return this;
    },
    delete_view : function(event) {
        event.preventDefault();
        this.$el.empty();
    },
    save : function(event) {
        event.preventDefault();
        var form = {};
        _.each(this.$('form').serializeArray(), function(element) {
            form[element.name] = element.value;
        });
        // console.log(form);
        // var note = new Note(form);
        // note.save();
        // notes_list.add(note);
        // console.log(note);
        notes_list.create(form);
    },

    select : function(event) {
        // console.log(this);
        // console.log('select');
        this.$(event.target).select();
    }
});

var NotesListView = Backbone.View.extend({
    el : $('#notes-list'),
    tpl : tpl.notes_list_tpl,
    events : {

    },

    initialize : function() {
        this.ul = this.$('ul');
        _.bindAll(this, 'render', 'add_one', 'add_all');
        notes_list.on('add', this.add_one);
        notes_list.on('reset', this.add_all);
        notes_list.fetch();
    },

    render : function() {
        return this;
    },

    add_one : function(note) {
        var view = new NoteItemView({
            'model' : note,
        });
        this.ul.append(view.render().el);
    },

    add_all : function() {
        notes_list.each(this.add_one);
    }
});

var NoteApp = Backbone.Router.extend({
    routes : {
        "" : "index",
        "notes" : "notes_list",
        "note/:query" : "note_detail",
        "new" : "note_create",
    },

    initialize : function() {

    },

    index : function() {

    },

    notes_list : function() {
        new NotesListView();
    }
});

var notes_list = new NotesList();
var notes_list_view = new NotesListView();

$('button[name="new"]').on('click', function() {
    var note_edit_view = new NoteEditView();
    note_edit_view.render();
});
