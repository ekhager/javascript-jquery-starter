(function (window) {

    "use strict";

    function Text(data) {
        this.value = data;
    }
    Text.prototype = {
        asHtml: function () {
            return "<span>" + this.value + "</span>";
        }
    };

    function Select(data) {
        this.value = data;
    }
    Select.prototype = {
        asHtml: function () {
            return "<span>" + this.value + "</span>";
        }
    };

    function Color(data) {
        this.value = data;
    }
    Color.prototype = {
        asHtml: function () {
            return "<span>" + this.value + "</span>";
        }
    };

    function Num(data) {
        this.value = data;
    }
    Num.prototype = {
        asHtml: function () {
            return "<span>" + this.value + "</span>";
        }
    };

    function DateTime(data) {
        this.value = new Date(data);
    }

    DateTime.prototype = {
        asText: function (pattern) {
            throw new Error("not implemented");
        },

        asHtml: function () {
            return "<time>" + this.value + "</time>";
        }
    };

    function Embed(data) {
        this.value = data;
    }

    Embed.prototype = {
        asHtml: function () {
            return "<span>" + this.value + "</span>";
        }
    };

    function ImageEl(main, views) {
        this.main = main;
        this.views = views || {};
    }
    ImageEl.prototype = {
        getView: function (key) {
            if (key === "main") {
                return this.main;
            } else {
                return this.views[key];
            }
        },
        asHtml: function () {
            return this.main.asHtml()
        }
    };

    function ImageView(url, width, height) {
        this.url = url;
        this.width = width;
        this.height = height;
    }
    ImageView.prototype = {
        ratio: function () {
            return this.width / this.height;
        },

        asHtml: function () {
            return "<img src=" + this.url + " width=" + this.width + " height=" + this.height + ">";
        }
    }

    function Group(tag, blocks) {
        this.tag = tag;
        this.blocks = blocks;
    }


    function StructuredText(blocks) {

        this.blocks = blocks;

    }

    StructuredText.prototype = {

        getTitle: function () {

        },

        getFirstParagraph: function() {


        },

        getFirstImage: function() {


        },

        asHtml: function() {
            return StructuredTextAsHtml.call(this, this.blocks);
        }

    };

    function Block() {};

    function BlockText() {};
    Text.prototype = new Block();

    function Heading(text, spans, level) {
        this.text = text;
        this.spans = spans;
        this.level = level;
    };
    Heading.prototype = new BlockText();

    function Paragraph(text, spans) {};
    Paragraph.prototype = new BlockText();

    function ListItem(text, spans, ordered) {
        this.text = text;
        this.spans = spans;
        this.ordered = ordered;
    };
    Paragraph.prototype = new BlockText();

    function BlockImage(view) {
        this.view = view;
    }
    BlockImage.prototype = new Block();

    function Span() {};
    function Em(start, end) {
        this.start = start;
        this.end = end;
    }
    Em.prototype = new Span();
    function Strong(start, end) {
        this.start = start;
        this.end = end;
    };
    Strong.prototype = new Span();

    function Hyperlink(start, end, link) {
        this.start = start;
        this.end = end;
        this.link = link;
    }
    Hyperlink.prototype = new Span();

    function StructuredTextAsHtml (blocks, linkResolver) {

        var groups = [],
            group,
            block,
            html = [];

        if (Array.isArray(blocks)) {
            blocks.forEach(function (block) {
                if (groups.length > 0) {
                    var lastGroup = groups[groups.length - 1];

                    group = new Group(null, []);
                    group.blocks.push(block);
                    groups.push(group);
                } else {
                    group = new Group(null, []);
                    group.blocks.push(block);
                    groups.push(group);
                }
            });

            groups.forEach(function (group) {
                if (group.tag) {
                    html.push("<" + group.tag + ">");
                    group.blocks.forEach(function (block) {
                        html.push(StructuredTextAsHtml(block));
                    });
                    html.push("</" + group.tag + ">");
                } else {
                    group.blocks.forEach(function (block) {
                        html.push(StructuredTextAsHtml(block));
                    });
                }
            });

        } else {
            if(blocks.type == "heading1") {
                html.push('<h1>' + blocks.text + '</h1>');
            }
            if(blocks.type == "heading2") {
                html.push('<h2>' + blocks.text + '</h2>');
            }
            if(blocks.type == "heading3") {
                html.push('<h3>' + blocks.text + '</h3>');
            }
            if(blocks.type == "paragraph") {
                html.push('<p>' + blocks.text + '</p>');
            }
            if(blocks.type == "image") {
                html.push('<p><img src="' + blocks.url + '"></p>');
            }
        }

        return html.join('');

    }

    function initField(field) {

        var output,
            img;

        switch (field.type) {

            case "Color":
                output = new Color(field.value);
                break;

            case "Number":
                output = new Num(field.value);
                break;

            case "Date":
                output = new DateTime(field.value);
                break;

            case "Text":
                output = new Text(field.value);
                break;

            case "Embed":
                throw new Error("not implemented");
                break;

            case "Select":
                output = new Select(field.value);
                break;

            case "Image":
                var img = field.value.main;
                output = new ImageEl(
                    new ImageView(
                        img.url,
                        img.dimensions.width,
                        img.dimensions.height
                    ),
                    field.value.views
                );
                break;

            case "StructuredText":
                output = new StructuredText(field.value);
                break;

            case "Link.Document":
                throw new Error("not implemented");
                break;

            case "Link.Web":
                throw new Error("not implemented");
                break;

            default:
                console.log("Type not found:", field.type);
                break;
        }

        return output;

    }


    window.Fragments = {
        Image: ImageEl,
        ImageView: ImageView,
        Text: Text,
        Number: Num,
        Date: DateTime,
        Select: Select,
        Color: Color,
        StructuredText: StructuredText,
        initField: initField
    }

}(window));
