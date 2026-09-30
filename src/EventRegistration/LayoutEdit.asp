

<%@ Language=VBScript %>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>
<!--#Include file="globalvariables.asp"--> 
 <title>Edit Website Layout</title>
 <% Page = "Editwebsite" %>
       <link rel="stylesheet" type="text/css" href="style.css">
		

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">
<!--#Include file="Header.asp"--> 


<!--#Include file="FormattingHeader.asp"--> 
<!--#Include file="LayoutHeader.asp"--> 
<table border = "0"  cellpadding=0 cellspacing=0 align = "center" width = "800">
	<tr>
		<td Class = "body"  align="center">
			<H2>Font Styles</H2></td>
	</tr>
	  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	  <tr><td class = "body2"  >The fonts below apply to your entire website. As you make changes to the fonts below they will automatically be updated on this page but not on your website. When you are happy with your changes select the publish button above.</td></tr>
</table>

	
<iframe src ="StyleFonts.asp?EventID=<%=EventID %>" width="804" height="250" align = "center" frameborder = "0" scrolling = "no" style="background-color:white">
<p>Your browser does not support iframes. </p>
</iframe>

<br><br>

	
<!-- #include virtual="Footer.asp" -->
 </Body>
</HTML>
