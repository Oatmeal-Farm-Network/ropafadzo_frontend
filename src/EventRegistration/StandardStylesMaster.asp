<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>

 <title>Edit Website Layout</title>
 <% Page = "Editwebsite" %>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include file="globalvariables.asp"--> 
<!--#Include file="Header.asp"--> 
<% 
  sql = "select * from EventSiteDesigntemp where EventID= " & EventID
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
Header = rs("Header")
logo = rs("Logo")
PagebackgroundImage = rs("PagebackgroundImage")
MenuBackgroundImage = rs("MenuBackgroundImage")
FooterImage = rs("FooterImage")
ScreenBackgroundImage = rs("ScreenBackgroundImage")
DBPagewidth = rs("Pagewidth")
DBPageAlign = rs("PageAlign")
DBLayoutStyle = rs("LayoutStyle")
DBScreenBackgroundColor = rs("ScreenBackgroundColor")
DBPageBorder = rs("PageBorder")
DBPageBorderColor = rs("PageBorderColor")
DBMenuBackgroundColor = rs("MenuBackgroundColor")
DBPageBackgroundColor = rs("PageBackgroundColor")


Pagewidth=Request.Form("Pagewidth" ) 
If Len(Pagewidth) > 1  then
Else
	Pagewidth = DBPagewidth
End If

PageAlign=Request.Form("PageAlign" )
If Len(PageAlign) > 1  then
Else
PageAlign = DBPageAlign
End If


LayoutStyle=Request.Form("LayoutStyle" ) 
If Len(LayoutStyle) > 1  then
Else
	LayoutStyle = DBLayoutStyle
End If

ScreenBackgroundColor=Request.Form("ScreenBackgroundColor" ) 
If Len(ScreenBackgroundColor) > 1  then
Else
ScreenBackgroundColor = DBScreenBackgroundColor
End If


PageBorder=Request.Form("PageBorder" ) 
If Len(PageBorder) > 1  then
Else
PageBorder = DBPageBorder
End If


PageBorderColor=Request.Form("PageBorderColor" ) 
If Len(PageBorderColor) > 1  then
Else
PageBorderColor = DBPageBorderColor
End If

MenuBackgroundColor=Request.Form("MenuBackgroundColor" ) 
If Len(MenuBackgroundColor) > 1  then
Else
MenuBackgroundColor = DBMenuBackgroundColor
End If

PageBackgroundColor=Request.Form("PageBackgroundColor" ) 
If Len(PageBackgroundColor) > 1  then
Else
PageBackgroundColor = DBPageBackgroundColor
End If


PageBackgroundColor=Request.Form("PageBackgroundColor" ) 
If Len(PageBackgroundColor) > 1  then
Else
PageBackgroundColor = DBPageBackgroundColor
End If




Query =  " UPDATE EventSiteDesigntemp Set LayoutStyle = '" & LayoutStyle & "', "
Query =  Query & " MenuBackgroundColor = '" & MenuBackgroundColor & "' ,"
Query =  Query & " PageBackgroundColor = '" & PageBackgroundColor & "'  "
Query =  Query & " where eventID = " & EventID 
'response.write(Query)	


Conn.Execute(Query) 

pagename = "layout"
%>


<!--#Include file="FormattingHeader.asp"--> 
<!--#Include file="LayoutHeader.asp"--> 

<% PageTitleText = "Layout"  %>
<!--#Include file="970Top.asp"-->	


<% 'response.write("Session(EventID) = " & Session("EventID") & "2<br>") %>
<iframe src ="StandardStyles.asp?EventID=<%=EventID%>" width="900" height="455" frameborder = "0" scrolling = "no" valign = "top" style="background-color:white" align = "center">
			 <p>Your browser does not support iframes.</p>
			</iframe>
			


<br>

<!--#Include file="970Bottom.asp"-->	<br>
<!-- #include virtual="Footer.asp" -->
 </Body>
</HTML>
