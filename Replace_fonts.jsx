/*
    フォント置換
 (c)2013 seuzo.jp


HowToUse
使いたい人は適当に設定を変えて使ってください。無保証。
※よいリストを作った人がいたら、ぜひ教えてください！

 
 History
 2013-09-18 AppleScript版（http://www.seuzo.jp/rubbs/search_html/msg01547.html ）を何度も追加して使っていたものをJavaScriptで書き直してみた。
 
 
 System;
 Mac OS X 10.7.5
 InDesign CS5（7.0.4）
 
 ToDo;
 リストの整理
 重複項目のチェック
 ロックされたオブジェクトやレイヤーの解除

	*/


#target "InDesign"

///////////////設定
var change_paragraph_style = true;//段落スタイル中のフォントも変更するかどうか
var change_character_style = true;//文字スタイル中のフォントも変更するかどうか

//["旧フォント名", "新フォント名"]のリスト。ファミリー名とスタイルの間にはタブを入れる。
//思うんだけどさ、このリストってCID（or TT or Type1）→OTFのほぼ完全リストって出来ると思うんだけど、
//はたして、それって実用的な速度が出るのかな？　必要なものだけをピックアップして適宜テーブルを替えられた方がいいような気がする。気がするだけだけど、完全主義ってよくない。
var fonts_list = [
["Century Old Style	Regular", "Century Old Style Std	Regular"],
["Century	Regular", "Century Old Style Std	Regular"],
["Century Old Style	B", "Century Old Style Std	Regular"],
["Century Old Style	Bold", "Century Old Style Std	Bold"],
["Century Old Style	Italic", "Century Old Style Std	Italic"],
["Times	Roman", "Times LT Std	Roman"],
["Courier	Medium", "Courier Std	Medium"],
["Helvetica	Medium", "Helvetica LT Std	Roman"],
["Helvetica	Black", "Helvetica LT Std	Black"],
["Helvetica	Bold", "Helvetica LT Std	Bold"],
["HelveCompressed	Regular", "Helvetica LT Std	Compressed"],
["Formata	Medium", "ITC Franklin Gothic Std	Medium"],
["O	CRBBold", "OCR B Std	Regular"],
["Futura (T1)	Bold Condensed", "Futura Std	Bold Condensed"],
["Futura (T1)	Book", "Futura Std	Book"],
["CB Futura CondensedBold	Regular", "Futura Std	Bold Condensed"],
["Futura (T1)	Bold", "Futura Std	Bold"],
["Futura (T1)	Medium Condensed", "Futura Std	Medium Condensed"],
["Gill Sans	Regular", "Gill Sans Std	Regular"],
["A-CID リュウミン B-KL	Regular", "A-OTF リュウミン Pro	B-KL"],
["A-CID リュウミン B-KL	B-KL", "A-OTF リュウミン Pro	B-KL"],
["A-CID リュウミン B-KL	B", "A-OTF リュウミン Pro	B-KL"],
["A-CID リュウミン M-KL	Regular", "A-OTF リュウミン Pro	M-KL"],
["A-CID リュウミン M-KL	M-KL", "A-OTF リュウミン Pro	M-KL"],
["A-CID リュウミン L-KL	M-KL", "A-OTF リュウミン Pro	M-KL"],
["A-CID リュウミン U-KL	Regular", "A-OTF リュウミン Pro	U-KL"],
["A-CID リュウミン U-KL	M-KL", "A-OTF リュウミン Pro	U-KL"],
["A-CID リュウミン H-KL	Regular", "A-OTF リュウミン Pro	H-KL"],
["A-CID リュウミンR-KL	Regular", "A-OTF リュウミン Pro	R-KL"],
["A-CID リュウミンL-KL	Regular", "A-OTF リュウミン Pro	L-KL"],
["A-CID リュウミン	L-KL", "A-OTF リュウミン Pro	L-KL"],
["A-CID リュウミンL-KL	L-KL", "A-OTF リュウミン Pro	L-KL"],
["A-CID 中ゴシックBBB	Medium", "A-OTF 中ゴシックBBB Pro	Medium"],
["A-CID 中ゴシックBBB	Regular", "A-OTF 中ゴシックBBB Pro	Medium"],
["A-CID 中ゴシックBBB	M-KL", "A-OTF 中ゴシックBBB Pro	Medium"],
["A-CID ゴシックMB101 B	Regular", "A-OTF ゴシックMB101 Pro	B"],
["A-CID ゴシックMB101 B	M-KL", "A-OTF ゴシックMB101 Pro	B"],
["A-CID ゴシックMB101 H	Regular", "A-OTF ゴシックMB101 Pro	H"],
["A-CID ゴシックMB101 H	M", "A-OTF ゴシックMB101 Pro	H"],
["A-CID ゴシックMB101 H	B", "A-OTF ゴシックMB101 Pro	H"],
["A-CID 太ゴB101	Regular", "A-OTF 太ゴB101 Pro	Bold"],
["A-CID 太ゴB101	Bold", "A-OTF 太ゴB101 Pro	Bold"],
["A-CID 太ゴB101	M-KL", "A-OTF 太ゴB101 Pro	Bold"],
["A-CID 太ミンA101	Regular", "A-OTF 太ミンA101 Pro	Bold"],
["A-CID 新ゴ U	Regular", "A-OTF 新ゴ Pro	U"],
["A-CID 新ゴ M	Regular", "A-OTF 新ゴ Pro	M"],
["A-CID 新ゴ M	M-KL", "A-OTF 新ゴ Pro	M"],
["A-CID 新ゴ L	Regular", "A-OTF 新ゴ Pro	L"],
["A-CID 新ゴ B	Regular", "A-OTF 新ゴ Pro	B"],
["A-CID 新ゴ B	Medium", "A-OTF 新ゴ Pro	B"],
["A-CID 新ゴ B	M-KL", "A-OTF 新ゴ Pro	B"],
["A-CID 新ゴ B	M", "A-OTF 新ゴ Pro	B"],
["A-CID 新ゴ R	B", "A-OTF 新ゴ Pro	R"],
["A-CID 新ゴ R	Regular", "A-OTF 新ゴ Pro	R"],
["A-CID 新ゴ R	M", "A-OTF 新ゴ Pro	R"],
["A-CID 見出ゴMB31	Regular", "A-OTF 見出ゴMB31 Pro	MB31"],
["A-CID じゅん34	Regular", "A-OTF じゅん Pro	34"],
["A-CID じゅん501	B", "A-OTF じゅん Pro	501"],
["A-CID じゅん501	Regular", "A-OTF じゅん Pro	501"],
];

//ローカルな感じの置き換えはあとでpushする
fonts_list.push(
["ＭＳ 明朝	Regular", "A-OTF リュウミン Pro	M-KL"],
["ＭＳ 明朝	M-KL", "A-OTF リュウミン Pro	M-KL"],
["ＭＳ ゴシック	Regular", "A-OTF 中ゴシックBBB Pro	Medium"],
["ＭＳ ゴシック	M-KL", "A-OTF 中ゴシックBBB Pro	Medium"],
["A-OTF リュウミン Pro	Italic", "Century Old Style Std	Italic"],
);



////////////////////////////////////////////エラー処理 
function myerror(mess) { 
  if (arguments.length > 0) { alert(mess); }
  exit();
}



////////////////////////////////////////////合成フォントを置換（★★★★フォントオブジェクトだと動かない。仕様が変わった時用に残しておく。）
function replace_composite_font_old(my_doc, old_font, new_font) {
    var my_doc, old_font, new_font;
    
    //合成フォントのループ。0番地は"[No composite font]"
    for (var i = 1; i < my_doc.compositeFonts.length; i++) {
        //$.writeln(my_doc.compositeFonts[i].name);
        for ( var ii = 0; ii < my_doc.compositeFonts[i].compositeFontEntries.length; ii++) {//それぞれのフォントについて
                //$.writeln(my_doc.compositeFonts[i].compositeFontEntries[ii].appliedFont.name);
            if ( my_doc.compositeFonts[i].compositeFontEntries[ii].appliedFont === old_font) {
                my_doc.compositeFonts[i].compositeFontEntries[ii].appliedFont = new_font;
            }
                //$.writeln(my_doc.compositeFonts[i].compositeFontEntries[ii].appliedFont.name);
        }
    }
}

////////////////////////////////////////////合成フォントを置換（これもうまく動かない時がある。なーんでか。）
function replace_composite_font(my_doc, old_font_family, old_font_style, new_font_family, new_font_style) {
    var my_doc, old_font_family, old_font_style, new_font_family, new_font_style;
    
    //合成フォントのループ。0番地は"[No composite font]"
    for (var i = 1; i < my_doc.compositeFonts.length; i++) {
        //$.writeln(my_doc.compositeFonts[i].name);
        for ( var ii = 0; ii < my_doc.compositeFonts[i].compositeFontEntries.length; ii++) {//それぞれのフォントについて
            var tmp_font = my_doc.compositeFonts[i].compositeFontEntries[ii];
            if ( (tmp_font.appliedFont === old_font_family) && (tmp_font.fontStyle === old_font_style) ) {
                tmp_font.appliedFont = new_font_family;
                tmp_font.fontStyle = new_font_style;
                //$.writeln(tmp_font.appliedFont);
            }
        }
    }
}



////////////////////////////////////////////段落スタイルの置換
function replace_paragraph_style(my_doc, old_font, new_font) {
    var my_doc, old_font, new_font;
    for (var i = 1; i< my_doc.allParagraphStyles.length; i++) {//0番地は、「[段落スタイルなし]」、
        if (my_doc.allParagraphStyles[i].appliedFont === old_font) {
            my_doc.allParagraphStyles[i].appliedFont = new_font;
        }
        //$.writeln(my_doc.allParagraphStyles[i].appliedFont.name);
    }
}


////////////////////////////////////////////文字スタイルの置換
function replace_Character_style(my_doc, old_font_family, old_font_style, new_font_family, new_font_style) {
    var my_doc, old_font_family, old_font_style, new_font_family, new_font_style;

    for (var i = 1; i< my_doc.allCharacterStyles.length; i++) {//0番地は、「[文字スタイルなし]」、
        //$.writeln(my_doc.allCharacterStyles[i].name);
        //$.writeln(my_doc.allCharacterStyles[i].appliedFont.reflect.name); //->String
        //$.writeln(my_doc.allParagraphStyles[i].appliedFont.reflect.name); //->Font
        if ((my_doc.allCharacterStyles[i].appliedFont === old_font_family) && (my_doc.allCharacterStyles[i].fontStyle === old_font_style)) {
            my_doc.allCharacterStyles[i].appliedFont = new_font_family;
            my_doc.allCharacterStyles[i].fontStyle = new_font_style;
        }
    }
}



////////////////////////////////////////////テキスト検索置換
//////////////////////★このスクリプト用にカスタマイズしてあります
/*
my_range	検索置換の範囲
my_find	検索オブジェクト ex.) {findWhat:"わたし"}
my_change	置換オブジェクト ex.)  {changeTo:"ぼく"}

my_changeが渡されない時は検索のみ、マッチしたオブジェクトを返す。
my_changeが渡されると置換が実行されて、返値はなし。
*/
function my_TextFindChange(my_range, my_find, my_change) {
	//検索の初期化
	app.findTextPreferences = NothingEnum.nothing;
	app.changeTextPreferences = NothingEnum.nothing;
	//検索オプション
    app.findChangeGrepOptions.includeLockedLayersForFind = true;//★ロックされたレイヤーをふくめるかどうか
    app.findChangeGrepOptions.includeLockedStoriesForFind = true;//★ロックされたストーリーを含めるかどうか
    app.findChangeGrepOptions.includeHiddenLayers = true;//★非表示レイヤーを含めるかどうか
    app.findChangeGrepOptions.includeMasterPages = true;//★マスターページを含めるかどうか
	app.findChangeTextOptions.includeFootnotes = true;//脚注を含めるかどうか
	app.findChangeTextOptions.kanaSensitive = true;//カナを区別するかどうか
	app.findChangeTextOptions.widthSensitive = true;//全角半角を区別するかどうか

	app.findTextPreferences.properties = my_find;//検索の設定
    if (my_change == null) {
        return my_range.findText();//検索のみの場合：マッチしたオブジェクトを返す
    } else {
        app.changeTextPreferences.properties = my_change;//置換の設定
        my_range.changeText();//検索と置換の実行
    }
}




/////実行
var my_attention = confirm("Replace_fonts.jsx\rドキュメント中のフォントをすべて置き換えます。合成フォントや段落スタイル中のフォントも置き換えします。\r    いうまでもなく、このスクリプトはドキュメントを破壊的に変更します。");
if (my_attention === false){exit()};//「いいえ」ボタンで終了


if (app.documents.length === 0) {myerror("ドキュメントが開かれていません")}
var my_doc = app.documents[0];


for (var i = 0; i <fonts_list.length; i++) {
    var old_font_family = fonts_list[i][0].split("\t")[0];
    var old_font_style = fonts_list[i][0].split("\t")[1];
    var new_font_family = fonts_list[i][1].split("\t")[0];
    var new_font_style = fonts_list[i][1].split("\t")[1];
    var old_font = app.fonts.itemByName(fonts_list[i][0]);
    var new_font = app.fonts.itemByName(fonts_list[i][1]);
    
    try {
        replace_composite_font(my_doc, old_font_family, old_font_style, new_font_family, new_font_style);
        if (change_paragraph_style) {replace_paragraph_style(my_doc, old_font, new_font)}
        if (change_character_style) {replace_Character_style(my_doc, old_font_family, old_font_style, new_font_family, new_font_style)}
        my_TextFindChange(my_doc, {appliedFont:old_font}, {appliedFont:new_font});
    } catch (e_message) {
        myerror("Error: \n" + e_message);
    }

}
myerror("Finished");
