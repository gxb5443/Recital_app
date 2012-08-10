/*

 VexFlow TabDiv 1.0-pre2
 Copyright 2010 Mohit Muthanna Cheppudira <mohit@muthanna.com>

 A library for embedding editable tablature into HTML5 pages, using
 the VexTab tablature language.

 - Requires jQuery and VexFlow for HTML5 Canvas rendering.
 - Requires Raphael.js for SVG and VML support.

 This library is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.

 This library must only be used in its original form. No tampering,
 modification, distribution, or repackaging is allowed without the
 explicit permission of the copyright holder.

 Build ID: prod-2@3b4fe69deed68b994ad137fd93a4c30c3657263f
 Build date: 2012-07-25 02:02:57.849339

*/
var a;Vex.Flow.VexTab=function(){this.init()};a=Vex.Flow.VexTab.prototype;a.init=function(){this.elements={staves:[],tabnotes:[],notes:[],ties:[],beams:[]};this.state={key_manager:new Vex.Flow.KeyManager("c"),clef:"treble",current_line:0,current_stave:-1,current_duration:"8",current_key:"C",has_notation:false,has_tab:true,beam_start:null};this.music=new Vex.Flow.Music;this.valid=false;this.last_error="";this.height=this.last_error_line=0;this.tuning=new Vex.Flow.Tuning};a.isValid=function(){return this.valid};
a.getElements=function(){return this.elements};a.getHeight=function(){return this.height};a.parse=function(b){this.init();b=b.split(/\r\n|\r|\n/);for(var d=0;d<b.length;++d){var g=b[d];this.state.current_line++;g=g.replace(/(^\s*)|(\s*$)/gi,"");g!=""&&this.parseLine(g)}this.valid=true;this.height+=30;return this};
a.parseError=function(b){this.valid=false;this.last_error=b;this.last_error_line=this.state.current_line;b=new Vex.RERR("ParseError","Line "+this.state.current_line+": "+b);b.line=this.state.current_line;throw b;};a.parseLine=function(b){b=b.split(/\s+/);var d=b[0];switch(d){case "tabstave":this.parseTabStave(b);break;case "notes":this.parseNotes(b);break;default:this.parseError("Invalid keyword: "+d)}};
a.parseKeyValue=function(b){var d=b.split(/\s*=\s*/);d.length!=2&&this.parseError("Invalid key value pair: "+b);return{key:d[0],value:d[1]}};
a.parseTabStave=function(b){var d=false,g=true,h="treble",i="C",j="";this.state.key_manager.reset();for(var e=1;e<b.length;++e){var c=this.parseKeyValue(b[e]);if(c.key.toLowerCase()=="notation")switch(c.value.toLowerCase()){case "true":d=true;break;case "false":d=false;break;default:this.parseError('notation must be "true" or "false": '+c.value)}else if(c.key.toLowerCase()=="tablature")switch(c.value.toLowerCase()){case "true":g=true;break;case "false":g=false;break;default:this.parseError('tablature must be "true" or "false": '+
c.value)}else if(c.key.toLowerCase()=="clef")switch(c.value.toLowerCase()){case "treble":h="treble";break;case "alto":h="alto";break;case "tenor":h="tenor";break;case "bass":h="bass";break;default:this.parseError("clef must be treble, alto, tenor, or bass: "+c.value)}else if(c.key.toLowerCase()=="key")if(Vex.Flow.keySignature.keySpecs[c.value]){i=c.value;this.state.current_key=c.value;this.state.key_manager.setKey(c.value)}else this.parseError("Invalid key signature: "+c.value);else if(c.key.toLowerCase()==
"time"){var k=new Vex.Flow.TimeSignature;try{k.parseTimeSpec(c.value);j=c.value}catch(f){this.parseError("Invalid time signature: "+c.value)}}else if(c.key.toLowerCase()=="tuning")try{this.tuning.setTuning(c.value)}catch(n){this.parseError("Invalid tuning: "+c.value)}else this.parseError("Invalid parameter for tabstave: "+c.key)}!g&&!d&&this.parseError('notation & tablature cannot both be "false"');this.genTabStave({notation:d,tablature:g,clef:h,key_signature:i,time_signature:j})};
a.parseNotes=function(b){for(var d=1;d<b.length;++d)switch(b[d]){case "|":this.genBar();break;case "[":this.parseOpenBeam();break;case "]":this.parseCloseBeam();break;default:this.parseToken(b[d]);this.genElements()}this.state.beam_start!=null&&this.parseError("Beam not closed")};
a.getNextRegExp=function(b){this.parse_state.done&&this.parseError("Unexpected end of line");if(b=this.parse_state.str.match(b)){this.parse_state.value=b[1];this.parse_state.str=b[2];if(this.parse_state.str=="")this.parse_state.done=true;return true}this.parseError("Error parsing notes at: "+this.parse_state.str);return false};a.getNextToken=function(){return this.getNextRegExp(/^(\d+|[\)\(-tbhpsvV\.\/\|\:])(.*)/)};a.getNextDurationToken=function(){return this.getNextRegExp(/^([0-9a-z]+|:)(.*)/)};
a.parseToken=function(b){this.parse_state={str:b,done:false,expecting_string:false,positions:[],durations:[],position_index:-1,annotations:[],bends:[],vibratos:[],ties:[],chord_ties:[],inside_bend:false,chord_index:-1};for(b=false;!b&&this.getNextToken();){switch(this.parse_state.value){case "(":this.parseOpenChord();break;case "t":this.parseTapAnnotation();break;default:this.parseFret()}b=this.parse_state.done}};
Vex.Flow.VexTab.validDurations={w:"w",h:"h",q:"q","8":"8","8d":"8d","16":"16","16d":"16d","32":"32","32d":"32d"};a=Vex.Flow.VexTab.prototype;
a.parseDuration=function(){this.getNextDurationToken();var b=Vex.Flow.VexTab.validDurations[this.parse_state.value];if(b)this.state.current_duration=b;else this.parseError("Invalid duration: "+this.parse_state.value);if(!this.parse_state.done){this.getNextDurationToken();this.parse_state.value!=":"&&this.parseError("Unexpected token: "+this.parse_state.str);this.parse_state.done||this.parseError("Unexpected token: "+this.parse_state.str)}};
a.parseOpenChord=function(){this.parse_state.positions.push([]);this.parse_state.durations.push(this.state.current_duration);this.parse_state.position_index++;this.parse_state.chord_index=-1;this.getNextToken();this.parseChordFret()};a.parseTapAnnotation=function(){this.parse_state.annotations.push({position:this.parse_state.position_index+1,text:"T"});this.getNextToken();switch(this.parse_state.value){case "(":this.parseOpenChord();break;default:this.parseFret()}};
a.parseChordFret=function(){if(this.parse_state.value==":"){this.parseFretDuration();this.parse_state.durations[this.parse_state.durations.length-1]=this.state.current_duration;if(this.parse_state.done)return;this.getNextToken()}var b=this.parse_state.value;isNaN(parseInt(b))&&this.parseError("Invalid fret number: "+b);this.getNextToken();if(this.parse_state.value=="b")this.parseChordBend();else this.parse_state.value!="/"&&this.parseError("Expecting / for string number: "+this.parse_state.value);
this.getNextToken();var d=parseInt(this.parse_state.value);isNaN(parseInt(d))&&this.parseError("Invalid string number: "+this.parse_state.value);this.parse_state.positions[this.parse_state.position_index].push({fret:b,str:d});this.parse_state.chord_index++;this.getNextToken();switch(this.parse_state.value){case ".":this.getNextToken();this.parseChordFret();break;case ")":this.parseCloseChord();break;default:this.parseError("Unexpected token: "+this.parse_state.value)}};
a.parseCloseChord=function(){this.chord_index=-1;if(!this.parse_state.done){this.getNextToken();switch(this.parse_state.value){case "h":this.parseChordTie();break;case "p":this.parseChordTie();break;case "s":this.parseChordTie();break;case "t":this.parseChordTie();break;case "v":this.parseVibrato();break;case "V":this.parseVibrato();break;default:this.parseError("Unexpected token: "+this.parse_state.value)}}};
a.parseChordBend=function(){this.getNextToken();var b=parseInt(this.parse_state.value);isNaN(b)&&this.parseError("Expecting fret: "+this.parse_state.value);if(this.parse_state.inside_bend)this.parse_state.bends[this.parse_state.bends.length-1].count++;else{this.parse_state.inside_bend=true;this.parse_state.bends.push({position:this.parse_state.position_index,count:1,index:this.parse_state.chord_index+1,to_fret:b})}this.getNextToken();switch(this.parse_state.value){case "b":this.parseChordBend();break;
case "/":break;default:this.parseError("Unexpected token: "+this.parse_state.value)}this.parse_state.inside_bend=false};a.parseFretDuration=function(){this.getNextDurationToken();var b=Vex.Flow.VexTab.validDurations[this.parse_state.value];if(b)this.state.current_duration=b;else this.parseError("Invalid duration: "+this.parse_state.value);if(!this.parse_state.done){this.getNextDurationToken();this.parse_state.value!=":"&&this.parseError("Unexpected token: "+this.parse_state.str)}};
a.parseFret=function(){if(this.parse_state.value==":"){this.parseFretDuration();if(this.parse_state.done)return;this.getNextToken()}var b=this.parse_state.value;isNaN(parseInt(b))&&this.parseError("Invalid fret number: "+b);this.parse_state.positions.push([{fret:b}]);this.parse_state.durations.push(this.state.current_duration);this.parse_state.position_index++;this.getNextToken();switch(this.parse_state.value){case "-":this.parseDash();break;case "/":this.parseSlash();break;case "b":this.parseBend();
break;case "s":this.parseTie();break;case "t":this.parseTie();break;case "h":this.parseTie();break;case "p":this.parseTie();break;case "v":this.parseFretVibrato();break;case "V":this.parseFretVibrato();break;default:this.parseError("Unexpected token: "+this.parse_state.value)}};a.parseDash=function(){this.parse_state.inside_bend=false;this.parse_state.expecting_string&&this.parseError("No dashes on strings: "+this.parse_state.str)};
a.parseVibrato=function(){var b=false;if(this.parse_state.value=="V")b=true;var d=this.parse_state.position_index;if(this.parse_state.inside_bend)d-=this.parse_state.bends[this.parse_state.bends.length-1].count;this.parse_state.vibratos.push({position:d,harsh:b})};
a.parseFretVibrato=function(){this.parseVibrato();this.getNextToken();switch(this.parse_state.value){case "-":this.parseDash();break;case "s":this.parseTie();break;case "h":this.parseTie();break;case "p":this.parseTie();break;case "t":this.parseTie();break;case "/":this.parseSlash();break;default:this.parseError("Unexpected token: "+this.parse_state.value)}};a.parseSlash=function(){this.parse_state.inside_bend=false;this.parse_state.expecting_string=true;this.getNextToken();this.parseString()};
a.parseString=function(){var b=this.parse_state.value;this.parse_state.positions.length==0&&this.parseError("String without frets: "+b);for(var d=0;d<this.parse_state.positions.length;++d)this.parse_state.positions[d][0].str=b};
a.parseTie=function(){this.parse_state.inside_bend=false;this.parse_state.expecting_string&&this.parseError("Unexpected token on string: "+this.parse_state.str);this.parse_state.ties.push({position:this.parse_state.position_index,index:this.parse_state.chord_index+1,effect:this.parse_state.value.toUpperCase()});this.getNextToken();this.parseFret()};
a.parseChordTie=function(){this.parse_state.chord_ties.push({position:this.parse_state.position_index,effect:this.parse_state.value.toUpperCase()});this.getNextToken();this.parse_state.value!="("&&this.parseError("Expecting ( after chord ties/slides");this.parseOpenChord()};
a.parseBend=function(){this.parse_state.expecting_string&&this.parseError("Unexpected token on string: "+this.parse_state.str);if(this.parse_state.inside_bend)this.parse_state.bends[this.parse_state.bends.length-1].count++;else{this.parse_state.inside_bend=true;this.parse_state.bends.push({position:this.parse_state.position_index,count:1,index:0})}this.getNextToken();this.parseFret()};
a.genElements=function(){function b(s){for(var q=s;q>=0;--q)if(i[q].persist==true)return q;throw new Vex.RERR("GenError","Invalid position: "+s);}this.state.current_stave==-1&&this.genTabStave();for(var d=this.parse_state.positions,g=this.parse_state.durations,h=this.state.clef,i=[],j=[],e=0;e<d.length;++e){var c=d[e],k=g[e],f=new Vex.Flow.TabNote({positions:c,duration:k});i.push({note:f,persist:true});if(this.state.has_notation){var n=[],l=[];for(f=0;f<c.length;++f){var m=c[f];m=this.tuning.getNoteForFret(m.fret,
m.str);m=Vex.Flow.keyProperties(m);var o=this.state.key_manager.selectNote(m.key);if(o.change)o.accidental==null?l.push("n"):l.push(o.accidental);else l.push(null);var t=o.note,r=m.octave;if(this.music.getNoteParts(o.note).root=="b"&&this.music.getNoteParts(m.key).root=="c")r--;else this.music.getNoteParts(o.note).root=="c"&&this.music.getNoteParts(m.key).root=="b"&&r++;n.push(t+"/"+r)}c=new Vex.Flow.StaveNote({keys:n,duration:k,clef:h});for(f=0;f<l.length;++f)l[f]&&c.addAccidental(f,new Vex.Flow.Accidental(l[f]));
j.push(c)}}f=this.parse_state.bends;for(e=0;e<f.length;++e){c=f[e];g=parseInt(d[c.position][c.index].fret);if(f[e].to_fret)h=f[e].to_fret;else{h=parseInt(d[c.position+1][c.index].fret);for(k=1;k<=c.count;++k)i[c.position+k].persist=false}k=false;if(c.count>1)k=true;l=i[c.position].note;switch(h-g){case 1:l.addModifier(new Vex.Flow.Bend("1/2",k),c.index);break;case 2:l.addModifier(new Vex.Flow.Bend("Full",k),c.index);break;case 3:l.addModifier(new Vex.Flow.Bend("1 1/2",k),c.index);break;case 4:l.addModifier(new Vex.Flow.Bend("2 Steps",
k),c.index);break;default:l.addModifier(new Vex.Flow.Bend("Bend to "+h,k),c.index)}}f=this.parse_state.vibratos;for(e=0;e<f.length;++e){c=f[e];i[c.position].note.addModifier((new Vex.Flow.Vibrato).setHarsh(c.harsh))}f=this.parse_state.annotations;for(e=0;e<f.length;++e){c=f[e];i[c.position].note.addModifier(new Vex.Flow.Annotation(c.text))}f=this.parse_state.ties;for(e=0;e<f.length;++e){g=f[e];var p=null;h=b(g.position);if(this.state.has_tablature)p=g.effect=="S"?new Vex.Flow.TabSlide({first_note:i[h].note,
last_note:i[g.position+1].note}):new Vex.Flow.TabTie({first_note:i[h].note,last_note:i[g.position+1].note},g.effect);this.state.has_notation&&this.elements.ties[this.state.current_stave].push(new Vex.Flow.StaveTie({first_note:j[h],last_note:j[g.position+1]}));p&&this.elements.ties[this.state.current_stave].push(p)}k=this.parse_state.chord_ties;for(e=0;e<k.length;++e){g=k[e];h=b(g.position);l=[];for(f=0;f<d[h].length;++f){c=d[h][f];l[c.str]={from:f}}for(f=0;f<d[g.position+1].length;++f){c=d[g.position+
1][f];l[c.str]||(l[c.str]={});l[c.str].to=f}c=[];n=[];for(f=0;f<l.length;++f)if(m=l[f])if(!(typeof m.from=="undefined"||typeof m.to=="undefined")){c.push(m.from);n.push(m.to)}if(this.state.has_tablature)p=g.effect=="S"?new Vex.Flow.TabSlide({first_note:i[h].note,last_note:i[g.position+1].note,first_indices:c,last_indices:n}):new Vex.Flow.TabTie({first_note:i[h].note,last_note:i[g.position+1].note,first_indices:c,last_indices:n},g.effect);this.state.has_notation&&this.elements.ties[this.state.current_stave].push(new Vex.Flow.StaveTie({first_note:j[h],
last_note:j[g.position+1],first_indices:c,last_indices:n}));this.elements.ties[this.state.current_stave].push(p)}for(e=0;e<i.length;++e){c=i[e];c.persist?this.elements.tabnotes[this.state.current_stave].push(c.note):this.elements.tabnotes[this.state.current_stave].push(new Vex.Flow.GhostNote(this.state.current_duration))}for(e=0;e<j.length;++e){c=j[e];this.elements.notes[this.state.current_stave].push(c)}};
a.genTabStave=function(b){var d=false,g=true,h="treble",i="C",j="";if(b){d=b.notation;g=b.tablature;h=b.clef;i=b.key_signature;j=b.time_signature}b=null;var e=40;if(d){b=(new Vex.Flow.Stave(20,this.height,380)).addClef(h).addKeySignature(i);j!=""&&b.addTimeSignature(j);e=b.getNoteStartX()}i=g?(new Vex.Flow.TabStave(20,d?b.getHeight()+this.height:this.height,380)).addTabGlyph().setNoteStartX(e):null;this.elements.staves.push({tab:i,note:b});this.height+=(g?i.getHeight():null)+(d?b.getHeight():null);
this.state.current_stave++;this.state.has_notation=d;this.state.has_tablature=g;this.state.clef=h;this.elements.tabnotes[this.state.current_stave]=[];this.elements.notes[this.state.current_stave]=[];this.elements.ties[this.state.current_stave]=[]};a.parseOpenBeam=function(){this.state.beam_start!=null&&this.parseError("Beam already open: [");this.state.beam_start=this.elements.notes[this.state.current_stave].length};
a.parseCloseBeam=function(){this.state.beam_start==null&&this.parseError("Can't close beam without openeing: ]");var b=this.elements.notes[this.state.current_stave].length;b-this.state.beam_start<2&&this.parseError("Must have at least two notes in a beam.");for(var d=[],g=this.state.beam_start;g<b;++g)d.push(this.elements.notes[this.state.current_stave][g]);this.elements.beams.push(new Vex.Flow.Beam(d));this.state.beam_start=null};
a.genBar=function(){this.state.current_stave==-1&&this.genTabStave();this.elements.tabnotes[this.state.current_stave].push(new Vex.Flow.BarNote);this.elements.notes[this.state.current_stave].push(new Vex.Flow.BarNote)};Vex.Flow.TabDiv=function(b){arguments.length>0&&this.init(b)};Vex.Flow.TabDiv.SEL=".vex-tabdiv";Vex.Flow.TabDiv.ERROR_NOCANVAS="<b>This browser does not support HTML5 Canvas</b><br/>Please use a modern browser such as <a href='http://google.com/chrome'>Google Chrome</a> or <a href='http://firefox.com'>Firefox</a>.";a=Vex.Flow.TabDiv.prototype;
a.init=function(b){this.sel=b;this.code=$(b).text();$(b).empty();this.width=$(b).attr("width")||400;this.height=$(b).attr("height")||200;this.scale=$(b).attr("scale")||1;if(typeof Raphael=="undefined"){this.canvas=$("<canvas></canvas>").addClass("vex-canvas");$(b).append(this.canvas);this.renderer=new Vex.Flow.Renderer(this.canvas[0],Vex.Flow.Renderer.Backends.CANVAS)}else{this.canvas=$("<div></div>").addClass("vex-canvas");$(b).append(this.canvas);this.renderer=new Vex.Flow.Renderer(this.canvas[0],
Vex.Flow.Renderer.Backends.RAPHAEL)}this.ctx_sel=$(b).find(".vex-canvas");this.renderer.resize(this.width,this.height);this.ctx=this.renderer.getContext();this.ctx.setBackgroundFillStyle(this.ctx_sel.css("background-color"));this.ctx.scale(this.scale,this.scale);this.editor=$(b).attr("editor")||"";this.editor_width=$(b).attr("editor_width")||this.width;this.editor_height=$(b).attr("editor_height")||200;var d=this;if(this.editor=="true"){this.text_area=$("<textarea></textarea>").addClass("editor").val(this.code);
this.editor_error=$("<div></div>").addClass("editor-error");$(b).append($("<p/>")).append(this.editor_error);$(b).append($("<p/>")).append(this.text_area);this.text_area.width(this.editor_width);this.text_area.height(this.editor_height);this.text_area.keyup(function(){d.timeoutID&&window.clearTimeout(d.timeoutID);d.timeoutID=window.setTimeout(function(){if(d.code!=d.text_area.val()){d.code=d.text_area.val();d.redraw()}},150)})}this.parser=new Vex.Flow.VexTab;this.extra_height=(this.message="vexflow.com")?
20:10;this.redraw()};a.redraw=function(){var b=this;Vex.BM("Total render time: ",function(){b.parse();b.draw()});return this};a.resize=function(){this.renderer.resize(this.width*this.scale,this.height*this.scale);this.ctx=this.renderer.getContext();this.ctx.scale(this.scale,this.scale)};
a.drawInternal=function(){if(!this.parser.isValid())return this;this.editor_error&&this.editor_error.empty();var b=this.parser.getElements(),d=b.staves;if(d.length==0){this.resize(this.width,10);this.ctx.clear();return this}var g=b.tabnotes,h=b.notes,i=b.ties;b=b.beams;this.height=this.parser.getHeight()+this.extra_height;this.resize(this.width,this.height);this.ctx.clear();this.ctx.setFont("Arial",10,"");for(var j=0;j<d.length;++j){var e=d[j].tab,c=d[j].note,k=g[j],f=i[j],n=h[j];if(e){e.setWidth(this.width-
50);e.setContext(this.ctx).draw()}if(c){c.setWidth(this.width-50);c.setContext(this.ctx).draw()}if(c&&e)Vex.Flow.Formatter.FormatAndDrawTab(this.ctx,e,c,k,n);else if(e)k&&Vex.Flow.Formatter.FormatAndDraw(this.ctx,e,k);else c&&n&&Vex.Flow.Formatter.FormatAndDraw(this.ctx,c,n);for(e=0;e<f.length;++e)f[e].setContext(this.ctx).draw()}for(e=0;e<b.length;++e)b[e].setContext(this.ctx).draw();if(this.message){this.ctx.setFont("Times",10,"italic");this.ctx.fillText(this.message,this.width/2-40,this.height-
10)}return this};a.parseInternal=function(){try{this.parser.parse(this.code)}catch(b){if(this.editor_error){this.editor_error.empty();this.editor_error.append($("<span></span>").addClass("text").html(b.message))}}return this};a.parse=function(){var b=this;Vex.BM("Parse time: ",function(){b.parseInternal()});return this};a.draw=function(){var b=this;Vex.BM("Draw time: ",function(){b.drawInternal()});return this};Vex.Flow.TabDiv.start=function(){$(Vex.Flow.TabDiv.SEL).each(function(){new Vex.Flow.TabDiv(this)})};
$(function(){Vex.Flow.TabDiv.SEL&&Vex.Flow.TabDiv.start()});
