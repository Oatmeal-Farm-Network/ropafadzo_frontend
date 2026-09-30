<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<!--#Include file="Frameglobalvariables.asp"--> 
 <title>Edit Font Styles</title>
 <% Page = "Editwebsite" %>
 <link rel="stylesheet" type="text/css" href="Framestyle.css">
	

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<table width = "<%=screenwidth %>" height = "250" bgcolor = "white" border = "0" cellspacing = "0" cellpadding = "0"><tr><td valign = "top">
<%

  sql = "select * from EventSiteDesigntemp where EventID= " & EventID
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
Header = rs("Header")
logo = rs("Logo")
sql = "select * from EventSiteDesigntemp where EventID= " & EventID

		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
    
 
MenuBackgroundColor = rs("MenuBackgroundColor")
PageBackgroundColor = rs("PageBackgroundColor")
FooterBackgroundColor = rs("FooterColor")
 
 MenuBackgroundImage = rs("MenuBackgroundImage")
PageBackgroundImage = rs("PageBackgroundImage")
FooterBackgroundImage = rs("FooterImage")



DBTitleColor = rs("TitleColor")
DBTitleFont = rs("TitleFont")
DBTitleSize = rs("TitleSize")
DBTitleAlign = rs("TitleAlign")
DBTitleWeight = rs("TitleWeight")
DBTitleItalics = rs("TitleItalics")

DBMenuColor = rs("MenuColor")
DBMenuFontMouseOverColor = rs("MenuFontMouseOverColor")
DBMenuSize = rs("MenuSize")
DBMenuFont = rs("MenuFont")
DBMenuAlign = rs("MenuAlign")
DBMenuWeight = rs("MenuWeight")
DBMenuItalics = rs("MenuItalics")
DBMenuHyperlinkColor = rs("MenuHyperlinkColor")



DBPageTextColor = rs("PageTextColor")
DBPageTextFontsize = rs("PageTextFontSize")
DBPageTextFont = rs("PageTextFont")
DBPageTextHyperlinkColor = rs("PageTextHyperlinkColor")
DBPageTextMouseOverColor = rs("PageTextMouseOverColor")
DBPageTextAlign = rs("PageTextAlign")
DBPageTextWeight = rs("PageTextWeight")
DBPageTextItalics = rs("PageTextItalics")

DBFooterColor = rs("FooterColor")
DBFooterTextColor = rs("FooterTextColor")
DBFooterTextSize = rs("FooterTextSize")
DBFooterTextFont = rs("FooterTextFont")
DBFooterHyperlinkColor = rs("FooterHyperlinkColor")
DBFooterMouseOverColor = rs("FooterMouseOverColor")
DBFooterAlign = rs("FooterAlign")
DBFooterWeight = rs("FooterWeight")
DBFooterItalics = rs("FooterItalics")
DBFooterImage = rs("FooterImage")

DBH2Color = rs("H2Color")
DBH2size = rs("H2Size")
DBH2Font = rs("H2Font")
DBH2HyperlinkColor = rs("H2HyperlinkColor")
DBH2MouseOverColor = rs("H2MouseOverColor")
DBH2Align = rs("H2Align")
DBH2Weight = rs("H2Weight")
DBH2Italics = rs("H2Italics")

DBH3Color = rs("H3Color")
DBH3size = rs("H3Size")
DBH3Font = rs("H3Font")
DBH3HyperlinkColor = rs("H3HyperlinkColor")
DBH3MouseOverColor = rs("H3MouseOverColor")
DBH3Align = rs("H3Align")
DBH3Weight = rs("H3Weight")
DBH3Italics = rs("H3Italics")

DBH4Color = rs("H4Color")
DBH4size = rs("H4Size")
DBH4Font = rs("H4Font")
DBH4HyperlinkColor = rs("H4HyperlinkColor")
DBH4MouseOverColor = rs("H4MouseOverColor")
DBH4Align = rs("H4Align")
DBH4Weight = rs("H4Weight")
DBH4Italics = rs("H4Italics")



TitleColor=Request.Form("TitleColor" )
If Len(TitleColor) > 0  then
Else
TitleColor = DBTitleColor
End If


TitleFont=Request.Form("TitleFont" )
If Len(TitleFont) > 0  then
Else
TitleFont= DBTitleFont
End If

TitleSize=Request.Form("TitleSize" )
If Len(TitleSize) > 0  then
Else
TitleSize= DBTitleSize
End If



TitleAlign=Request.Form("TitleAlign" )
If Len(TitleAlign) > 0  then
Else
TitleAlign= DBTitleAlign
End If

TitleWeight=Request.Form("TitleWeight" )
If Len(TitleWeight) > 0  then
Else
TitleWeight= DBTitleWeight
End If

TitleItalics=Request.Form("TitleItalics" )
If Len(TitleItalics) > 0  then
Else
TitleItalics= DBTitleItalics
End If

MenuColor=Request.Form("MenuColor" )
If Len(MenuColor) > 0  then
Else
MenuColor= DBMenuColor
End If



MenuHyperlinkColor=Request.Form("MenuHyperlinkColor" )
If Len(MenuHyperlinkColor) > 0  then
Else
MenuHyperlinkColor= DBMenuHyperlinkColor
End If



MenuFontMouseOverColor=Request.Form("MenuFontMouseOverColor" )
If Len(MenuFontMouseOverColor) > 0  then
Else
MenuFontMouseOverColor= DBMenuFontMouseOverColor
End If

MenuSize=Request.Form("MenuSize" )
If Len(MenuSize) > 0  then
Else
MenuSize= DBMenuSize
End If

MenuFont=Request.Form("MenuFont" )
If Len(MenuFont) > 0  then
Else
MenuFont= DBMenuFont
End If

MenuAlign=Request.Form("MenuAlign" )
If Len(MenuAlign) > 0  then
Else
MenuAlign= DBMenuAlign
End If

MenuWeight=Request.Form("MenuWeight" )
If Len(MenuWeight) > 0  then
Else
MenuWeight= DBMenuWeight
End If

MenuItalics=Request.Form("MenuItalics" )
If Len(MenuItalics) > 0  then
Else
MenuItalics= DBMenuItalics
End If



PageTextColor=Request.Form("PageTextColor" )
If Len(PageTextColor) > 0  then
Else
PageTextColor= DBPageTextColor
End If

PageTextFontsize=Request.Form("PageTextFontsize" )
If Len(PageTextFontsize) > 0  then
Else
PageTextFontsize= DBPageTextFontsize
End If

PageTextFont=Request.Form("PageTextFont" )
If Len(PageTextFont) > 0  then
Else
PageTextFont= DBPageTextFont
End If

PageTextHyperlinkColor=Request.Form("PageTextHyperlinkColor" )
If Len(PageTextHyperlinkColor) > 0  then
Else
PageTextHyperlinkColor= DBPageTextHyperlinkColor
End If

PageTextMouseOverColor=Request.Form("PageTextMouseOverColor" )
If Len(PageTextMouseOverColor) > 0  then
Else
PageTextMouseOverColor= DBPageTextMouseOverColor
End If

PageTextAlign =Request.Form("PageTextAlign" )
If Len(PageTextAlign) > 0  then
Else
PageTextAlign= DBPageTextAlign
End If

PageTextWeight =Request.Form("PageTextWeight" )
If Len(PageTextWeight) > 0  then
Else
PageTextWeight= DBPageTextWeight
End If

PageTextItalics =Request.Form("PageTextItalics" )
If Len(PageTextItalics) > 0  then
Else
PageTextItalics= DBPageTextItalics
End If

FooterColor=Request.Form("FooterColor" )
If Len(FooterColor) > 0  then
Else
FooterColor= DBFooterColor
End If

FooterTextColor=Request.Form("FooterTextColor" )
If Len(FooterTextColor) > 0  then
Else
FooterTextColor= DBFooterTextColor
End If



FooterTextSize=Request.Form("FooterTextSize" )
If Len(FooterTextSize) > 0  then
Else
FooterTextSize= DBFooterTextSize
End If


FooterTextFont =Request.Form("FooterTextFont" )
If Len(FooterTextFont) > 0  then
Else
FooterTextFont= DBFooterTextFont
End If

FooterHyperlinkColor=Request.Form("FooterHyperlinkColor" )
If Len(FooterHyperlinkColor) > 0  then
Else
FooterHyperlinkColor= DBFooterHyperlinkColor
End If

FooterMouseOverColor =Request.Form("FooterMouseOverColor" )
If Len(FooterMouseOverColor) > 0  then
Else
FooterMouseOverColor= DBFooterMouseOverColor
End If

FooterAlign =Request.Form("FooterAlign" )
If Len(FooterAlign) > 0  then
Else
FooterAlign= DBFooterAlign
End If

FooterWeight =Request.Form("FooterWeight" )
If Len(FooterWeight) > 0  then
Else
FooterWeight= DBFooterWeight
End If


FooterItalics =Request.Form("FooterItalics" )
If Len(FooterItalics) > 0  then
Else
FooterItalics= DBFooterItalics
End If

FooterImage=Request.Form("FooterImage" )
If Len(FooterImage) > 0  then
Else
FooterImage= DBFooterImage
End If



H2Color =Request.Form("H2Color" )
If Len(H2Color) > 0  then
Else
H2Color= DBH2Color
End If

H2size =Request.Form("H2size" )
If Len(H2size) > 0  then
Else
H2size= DBH2size
End If

H2Font =Request.Form("H2Font" )
If Len(H2Font) > 0  then
Else
H2Font= DBH2Font
End If

H2HyperlinkColor =Request.Form("H2HyperlinkColor" )
If Len(H2HyperlinkColor) > 0  then
Else
H2HyperlinkColor= DBH2HyperlinkColor
End If

H2MouseOverColor = Request.Form("H2MouseOverColor" )
If Len(H2MouseOverColor) > 0  then
Else
H2MouseOverColor= DBH2MouseOverColor
End If

H2Align = Request.Form("H2Align" )
If Len(H2Align) > 0  then
Else
H2Align = DBH2Align
End If

H2Weight= Request.Form("H2Weight" )
If Len(H2Weight) > 0  then
Else
H2Weight= DBH2Weight
End If


H2Italics = Request.Form("H2Italics" )
If Len(H2Italics) > 0  then
Else
H2Italics= DBH2Italics
End If

H3Color = Request.Form("H3Color" )
If Len(H3Color) > 0  then
Else
H3Color= DBH3Color
End If


H3size = Request.Form("H3size" )
If Len(H3size) > 0  then
Else
H3size= DBH3size
End If


H3Font = Request.Form("H3Font" )
If Len(H3Font) > 0  then
Else
H3Font= DBH3Font
End If


H3HyperlinkColor = Request.Form("H3HyperlinkColor" )
If Len(H3HyperlinkColor) > 0  then
Else
H3HyperlinkColor= H3HyperlinkColor
End If


H3MouseOverColor = Request.Form("H3MouseOverColor" )
If Len(H3MouseOverColor) > 0  then
Else
H3MouseOverColor= H3MouseOverColor
End If


H3Align = Request.Form("H3Align" )
If Len(H3Align) > 0  then
Else
H3Align= DBH3Align
End If


H3Weight = Request.Form("H3Weight" )
If Len(H3Weight) > 0  then
Else
H3Weight= DBH3Weight
End If


H3Italics = Request.Form("H3Italics" )
If Len(H3Italics) > 0  then
Else
H3Italics= DBH3Italics
End If



H4Color= Request.Form("H4Color" )
If Len(H4Color) > 0  then
Else
H4Color= DBH4Color
End If



H4size = Request.Form("H4size" )
If Len(H4size) > 0  then
Else
H4size= DBH4size
End If



H4Font = Request.Form("H4Font" )
If Len(H4Font) > 0  then
Else
H4Font= DBH4Font
End If


H4HyperlinkColor = Request.Form("H4HyperlinkColor" )
If Len(H4HyperlinkColor) > 0  then
Else
H4HyperlinkColor= H4HyperlinkColor
End If


H4MouseOverColor = Request.Form("H4MouseOverColor" )
If Len(H4MouseOverColor) > 0  then
Else
H4MouseOverColor= DBH4MouseOverColor
End If


H4Align = Request.Form("H4Align" )
If Len(H4Align) > 0  then
Else
H4Align= DBH4Align
End If


H4Weight = Request.Form("H4Weight" )
If Len(H4Weight) > 0  then
Else
H4Weight= DBH4Weight
End If


H4Italics = Request.Form("H4Italics" )
If Len(H4Italics) > 0  then
Else
H4Italics= DBH4Italics
End If

if len(FooterTextSize) > 1 then
else
FooterTextSize = "10"
end if
%> 



  
<style>

	BODY {background: <%=PageColor %>; 	background-image : url(<%=ScreenBackgroundImage %>);}
	
		.Footer {font: <%=FooterTextSize%>pt <%=FooterTextFont %>; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=FooterTextColor%> ; text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Footer {font: <%=FooterTextSize%>pt <%=FooterTextFont%>; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=FooterHyperlinkColor %>; text-decoration :none; text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=FooterTextSize +2 %>px; PADDING-TOP: 0px; }
		A.Footer:hover {font: <%=FooterTextSize%>pt <%=FooterTextFont%>; color: <%=FooterMouseOverColor%> ; text-decoration :none; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %>  text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=FooterTextSize +2 %>px; PADDING-TOP: 0px; }

		H1 {font: <%=TitleSize %>pt <%=TitleFont %>; font-weight:  <%=TitleWeight %> ;  <% if TitleItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=TitleColor %>; text-align: <%=TitleAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 36 %>px; PADDING-TOP: 0px; }
		H2 {font: <%=H2Size %>pt <%=H2Font %>;  font-weight:  <%=TitleWeight %> ;  <% if H2Italics = "Yes" then %> font-style: italic;<% end if %> color: <%=H2Color %>; text-align: <%=H2Align %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 26 %>px; PADDING-TOP: 0px; }
		H3 {font: <%=H3Size %>pt <%=H3Font %>;  font-weight:  <%=TitleWeight %> ;  <% if H2Italics = "Yes" then %> font-style: italic;<% end if %> color: <%=H3Color %>; text-align: <%=H3Align %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 6 %>px; PADDING-TOP: 0px; }

		LI UL {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; color: <%=PageTextHyperlinkColor %>; text-decoration :none;}
		.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>;  font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=PageTextColor %>; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %>  color: <%=PageTextHyperlinkColor %>; text-decoration :none; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Body:hover {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; color: <%=PageTextHyperlinkColor %>; font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=PageTextMouseOverColor %> ; text-decoration :none; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		
		
		.Menu {font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=MenuColor %>; text-align: center; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Menu {font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=MenuHyperlinkColor %>; text-align: center; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; text-decoration :none;}

		A.Menu:Hover { font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %>  color: <%=MenuFontMouseOverColor %> ; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		

</style>

<a name="Top"></a>
<form action= 'StyleFonts.asp?EventID=<%=EventID %>' method = "post">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "100%">
	<tr>
		<td class = "body" width = "392" valign = "top"> 	 
		   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "100%">

<tr>
  <td class = "body" bgcolor = "<%=PageBackgroundColor%>"  background = "<%=PageBackgroundImage%>" colspan = "2" height = "20"><H1>Page Headings</H1></td>
</tr>

<tr>
	<td class = "small" align = "right" >
		Font Face:
		<Font face="<%=TitleFont%>"></font>
		</td>
		<td>
			<select size="1" name="TitleFont" onchange="submit();" style="width:180">
					<option value= "<%=TitleFont%>" selected><%=TitleFont%></option>
					<option  value="Arial" ><font face = "Arial">Arial</font></option>
					<option  value="Century Gothic" ><font face = "Century Gothic">Century Gothic</font></option>	
					<option  value="Comic Sans"><div class = "comic">Comic Sans</div></option>
					<option  value="Copperplate Gothic Light" ><font face = "Copperplate Gothic Light">Copperplate Gothic Light</font></option>					
					<option  value="Courier New" ><font face = "Courier New">Courier New</font></option>
					<option  value="Georgia" ><font face = "Georgia">Georgia</font></option>
					<option  value="Gill Sans" ><font face = "Gill Sans">Gill Sans</font></option>
					<option  value="Lucida Console" ><font face = "Lucida Console">Lucida Console</font></option>
					<option  value="Lucida Sans Unicode" ><font face = "Lucida Sans Unicode">Lucida Sans Unicode</font></option>				
					<option  value="Palatino Linotype" STYLE="font-family : Palatino Linotype; font-size : 122pt">Palatino Linotype</option>
					<option  value="Tahoma" ><font face = "Tahoma">Tahoma</font></option>	
					<option  value="Times New Roman" ><font face = "Times New Roman">Times New Roman</font></option>
					<option  value="Trebuchet MS" ><font face = "Trebuchet MS">Trebuchet MS</font></option>		
					<option  value="Verdana" ><font face = "Verdana">Verdana</font></option>
					</select>


		</td>
	</tr>
<tr>
	<td class = "small" align = "right">
		Font Color:
	</td>
	<td>
		<select size="1" name="TitleColor" onchange="submit();" style="width:180">
		<option value= "<%=TitleColor%>" selected><%=TitleColor%></option>
		<!--#Include file="ColorOptionsInclude.asp"--> 	
		</select>
		</td>
	</tr>
	<tr>
		<td class = "small" align = "right">
			Font Size:
		</td>
		<td>
			<select size="1" name="TitleSize" onchange="submit();" style="width:180">
					<option value= "<%=TitleSize%>" selected><%=TitleSize%></option>
					<option value="9" >9</option>	
					<option value="10" >10</option>	
					<option value="11" >11</option>	
					<option value="12" >12</option>	
					<option value="13" >13</option>	
					<option value="14" >14</option>
					<option  value="15" >15</option>
					<option  value="16" >16</option>
					<option  value="17" >17</option>
					<option  value="20" >20</option>
					<option  value="24" >24</option>
					<option  value="28" >28</option>
			</select>

	
		</td>
	</tr>
<tr>
		<td class = "small" align = "right">
			Font Weight:
		</td>
		<td>
			<select size="1" name="TitleWeight" onchange="submit();" style="width:180">
					<option value= "<%=TitleWeight%>" selected><%=TitleWeight%></option>
					<option value="Normal" >Normal</option>	
					<option value="Bold" >Bold</option>	
			</select>
		</td>
	</tr>
</table>
</td>

<tr></tr>

<td valign = "top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "400">
  <td class = "menu" bgcolor = "<%=MenuBackgroundColor%>" background = "<%=MenuBackgroundImage%>"colspan = "2" height = "20"><a href = "#" class = "Menu">Menu Link</a></td>
</tr>

<tr>
	<td class = "small" width = "195" align = "right">
		Font Face:
		<Font face="<%=MenuFont%>"></font>
		</td>
		<td>
			<select size="1" name="MenuFont" onchange="submit();" style="width:180">
					<option value= "<%=MenuFont%>" selected><Font face="<%=MenuFont%>"><%=MenuFont%></font></option>
					<option  value="Arial" ><font face = "Arial">Arial</font></option>
					<option  value="Century Gothic" ><font face = "Century Gothic">Century Gothic</font></option>	
					<option  value="Comic Sans"><div class = "comic">Comic Sans</div></option>
					<option  value="Copperplate Gothic Light" ><font face = "Copperplate Gothic Light">Copperplate Gothic Light</font></option>					
					<option  value="Courier New" ><font face = "Courier New">Courier New</font></option>
					<option  value="Georgia" ><font face = "Georgia">Georgia</font></option>
					<option  value="Gill Sans" ><font face = "Gill Sans">Gill Sans</font></option>
					<option  value="Lucida Console" ><font face = "Lucida Console">Lucida Console</font></option>
					<option  value="Lucida Sans Unicode" ><font face = "Lucida Sans Unicode">Lucida Sans Unicode</font></option>				
					<option  value="Palatino Linotype" STYLE="font-family : Palatino Linotype; font-size : 122pt">Palatino Linotype</option>
					<option  value="Tahoma" ><font face = "Tahoma">Tahoma</font></option>	
					<option  value="Times New Roman" ><font face = "Times New Roman">Times New Roman</font></option>
					<option  value="Trebuchet MS" ><font face = "Trebuchet MS">Trebuchet MS</font></option>		
					<option  value="Verdana" ><font face = "Verdana">Verdana</font></option>
	
					</select>


		</td>
	</tr>

<tr>
	<td class = "small" align = "right">
			Link Color:
		</td>
		<td>
			<select size="1" name="MenuHyperlinkColor" style="width:180" onchange="submit();">
					<option value= "<%=MenuHyperlinkColor%>" selected><%=MenuHyperlinkColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
				
					</select>

	
		</td>
	</tr>
	<tr>
	<td class = "small" align = "right">
			Link Mouseover Color:
		</td>
		<td>
			<select size="1" name="MenuFontMouseOverColor"style=" width:180" onchange="submit();">
					<option value= "<%=MenuFontMouseOverColor%>" selected><%=MenuFontMouseOverColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
				
					</select>

	
		</td>
</tr>




<tr>
  <td class = "Body" bgcolor = "<%=PageBackgroundColor%>" background = "<%=PageBackgroundImage%>" colspan = "2" height = "20">Body Text <a href = "#" class = "Body">Body Text Link</a> </td>
</tr>
<tr>

<tr>
	<td class = "small" align = "right">
		Page Text Font:
		</td>
		<td>
			<select size="1" name="PageTextFont" style="width:180" onchange="submit();">
					<option value= "<%=PageTextFont%>" selected><Font face="<%=PageTextFont%>"><%=PageTextFont%></font></option>
					<option  value="Arial" ><font face = "Arial">Arial</font></option>
					<option  value="Century Gothic" ><font face = "Century Gothic">Century Gothic</font></option>	
					<option  value="Comic Sans"><div class = "comic">Comic Sans</div></option>
					<option  value="Copperplate Gothic Light" ><font face = "Copperplate Gothic Light">Copperplate Gothic Light</font></option>					
					<option  value="Courier New" ><font face = "Courier New">Courier New</font></option>
					<option  value="Georgia" ><font face = "Georgia">Georgia</font></option>
					<option  value="Gill Sans" ><font face = "Gill Sans">Gill Sans</font></option>
					<option  value="Lucida Console" ><font face = "Lucida Console">Lucida Console</font></option>
					<option  value="Lucida Sans Unicode" ><font face = "Lucida Sans Unicode">Lucida Sans Unicode</font></option>				
					<option  value="Palatino Linotype" STYLE="font-family : Palatino Linotype; font-size : 122pt">Palatino Linotype</option>
					<option  value="Tahoma" ><font face = "Tahoma">Tahoma</font></option>	
					<option  value="Times New Roman" ><font face = "Times New Roman">Times New Roman</font></option>
					<option  value="Trebuchet MS" ><font face = "Trebuchet MS">Trebuchet MS</font></option>		
					<option  value="Verdana" ><font face = "Verdana">Verdana</font></option>
	
					</select>


		</td>
	</tr>
	<tr>
		<td class = "small" align = "right">
			Color:
		</td>
		<td>
			<select size="1" name="PageTextColor" style="width:180" onchange="submit();">
					<option value= "<%=PageTextColor%>" selected><%=PageTextColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
				
					</select>

	
		</td>
	</tr>
	
		<tr>
		<td class = "small" align = "right" >
			Page Text Size:
		</td>
		<td>
			<select size="1" name="PageTextFontSize"  style="width:180" onchange="submit();" >
					<option value= "<%=PageTextFontSize%>" selected><%=PageTextFontSize%></option>
								<option value="8" >8</option>	
											<option value="9" >9</option>	
					<option value="10" >10</option>	
					<option value="11" >11</option>
					<option  value="13" >13</option>
			</select>

	
		</td>
	</tr>
	<tr>
	<td class = "small" align = "right">
			Link Color:
		</td>
		<td>
			<select size="1" name="PageTextHyperlinkColor" style="width:180" onchange="submit();">
					<option value= "<%=PageTextHyperlinkColor%>" selected><%=PageTextHyperlinkColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
				
					</select>

	
		</td>
	</tr>
	<tr>
	<td class = "small" align = "right">
			Link Mouseover Color:
		</td>
		<td>
			<select size="1" name="PageTextMouseOverColor"style=" width:180" onchange="submit();">
					<option value= "<%=PageTextMouseOverColor%>" selected><%=PageTextMouseOverColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
				
					</select>

	
		</td>
</tr>


</table>


		</td>
	</tr>
</table>
</form>

	


<%	Query =  " UPDATE EventSiteDesignTemp Set TitleColor = '" & TitleColor  & "' ,"
	Query =  Query & " TitleFont = '" & TitleFont  & "' ,"
	Query =  Query & " TitleSize = '" & TitleSize & "' ,"
	Query =  Query & " TitleAlign = '" & TitleAlign & "' ,"
	Query =  Query & " TitleWeight = '" & TitleWeight & "' ,"
	Query =  Query & " TitleItalics = '" & TitleItalics & "' ,"

	Query =  Query & "  MenuColor= '" & MenuColor & "' ,"
	Query =  Query & " MenuFontMouseOverColor = '" & MenuFontMouseOverColor & "' ,"
	Query =  Query & "  MenuSize= '" & MenuSize & "' ,"
	Query =  Query & "  MenuFont= '" & MenuFont & "' ,"
	Query =  Query & "  MenuAlign= '" & MenuAlign & "' ,"
	Query =  Query & " MenuWeight = '" & MenuWeight & "' ,"
	Query =  Query & " MenuItalics = '" & MenuItalics & "' ,"
	Query =  Query & " MenuHyperlinkColor = '" & MenuHyperlinkColor & "' ,"

	Query =  Query & " PageTextColor = '" & PageTextColor & "' ,"
	Query =  Query & " PageTextFont = '" & PageTextFont & "' ,"
	Query =  Query & " PageTextFontSize = '" & PageTextFontSize & "' ,"
	Query =  Query & " PageTextHyperlinkColor = '" & PageTextHyperlinkColor & "' ,"
	Query =  Query & " PageTextMouseOverColor = '" & PageTextMouseOverColor & "' ,"
	Query =  Query & " PageTextAlign = '" & PageTextAlign & "' ,"
	Query =  Query & " PageTextWeight = '" & PageTextWeight & "' ,"
	Query =  Query & " PageTextItalics = '" & PageTextItalics & "' ,"

	Query =  Query & " FooterColor = '" & FooterColor & "' ,"
	Query =  Query & " FooterTextColor = '" & FooterTextColor & "' ,"
	Query =  Query & " FooterTextFont = '" & FooterTextFont & "' ,"
	Query =  Query & " FooterHyperlinkColor = '" & FooterHyperlinkColor & "' ,"
	Query =  Query & " FooterMouseOverColor = '" & FooterMouseOverColor & "' ,"
	Query =  Query & " FooterTextSize = '" & FooterTextSize & "' ,"
	Query =  Query & " FooterAlign = '" & FooterAlign & "' ,"
	Query =  Query & " FooterWeight = '" & FooterWeight & "' ,"
	Query =  Query & " FooterItalics = '" & FooterItalics & "' ,"


	Query =  Query & " H2Color = '" & H2Color & "' ,"
	Query =  Query & " H2Font = '" & H2Font & "' ,"
	Query =  Query & " H2HyperlinkColor = '" & H2HyperlinkColor & "' ,"
	Query =  Query & " H2MouseOverColor = '" & H2MouseOverColor & "' ,"
	Query =  Query & " H2Size = '" & H2Size & "' ,"
	Query =  Query & " H2Align = '" & H2Align & "' ,"
	Query =  Query & " H2Weight = '" & H2Weight & "' ,"
	Query =  Query & " H2Italics = '" & H2Italics & "' ,"

	Query =  Query & " H3Color = '" & H3Color & "' ,"
	Query =  Query & " H3Font = '" & H3Font & "' ,"
	Query =  Query & " H3HyperlinkColor = '" & H3HyperlinkColor & "' ,"
	Query =  Query & " H3MouseOverColor = '" & H3MouseOverColor & "' ,"
	Query =  Query & " H3Size = '" & H3Size & "' ,"
	Query =  Query & " H3Align = '" & H3Align & "' ,"
	Query =  Query & " H3Weight = '" & H3Weight & "' ,"
	Query =  Query & " H3Italics = '" & H3Italics & "' ,"


	Query =  Query & " H4Color = '" & H4Color & "' ,"
	Query =  Query & " H4Font = '" & H4Font & "' ,"
	Query =  Query & " H4HyperlinkColor = '" & H4HyperlinkColor & "' ,"
	Query =  Query & " H4MouseOverColor = '" & H4MouseOverColor & "' ,"
	Query =  Query & " H4Size = '" & H4Size & "' ,"
	Query =  Query & " H4Align = '" & H4Align & "' ,"		
	Query =  Query & " H4Weight = '" & H4Weight & "' ,"
	Query =  Query & " H4Italics = '" & H4Italics & "' "

   Query =  Query & " where EventID = " & EventID

'response.write(Query)	

Conn.Execute(Query) 
	

%>
	



</body>
</html>
