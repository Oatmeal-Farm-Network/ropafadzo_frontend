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
UpdateHeaderText = request.QueryString("UpdateHeaderText")
if UpdateHeaderText="True" then
    HeaderText = request.Form("HeaderText")
    ShowEventName = Request.Form("ShowEventName")

    str1 = HeaderText
    str2 = "'"
    If InStr(str1,str2) > 0 Then
	   HeaderText= Replace(str1,  str2, "''")
    End If  

Query =  " UPDATE EventSiteDesign Set HeaderText = '" & HeaderText & "', "
Query =  Query & " ShowEventName  = " &  ShowEventName  & " " 
Query =  Query & " where eventID = " & EventID 
'response.Write("Query=" & Query)
Conn.Execute(Query) 
end if

'response.write(sql)
	sql = "select * from EventSiteDesign where EventID= " & EventID 
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        HeaderText = rs("HeaderText")
        ShowEventName  = rs("ShowEventName")
    end if

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
			



<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "899" align = "center">
	<tr>
		<td Class = "body"><br><br><a name = "Images"></a>
			<h2>Images</h2>
	</tr>
	<tr><td  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>







<table width = "900" cellpadding = "0" cellspacing = "0" border = "0" align = "center">
  <tr>
    <td width = "440" valign = "top">
<table width = "440" cellpadding = "0" cellspacing = "0" border = "0" align = "center">
  <tr>
    <td width = "440" valign = "top">
		<h2>Header Background Images: <% If Len(Header) > 1 then%>
		<img src = "<%= Header%>" height = "25">
		<% End If %></h2>
	</td>
</tr>
<tr>
	<td class = "body"  bgcolor = "DBF5F2">
				<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadHeaderhandle2.asp?EventID=<%=Session("EventID")%>" >
				
						
						<% If Header = "ImageNotAvailable.jpg" Then %>
								Current Logo Image Name: Not Defined<br>
						<% End If %>

						Upload Header: <input name="attach1" type="file" size=45 ><br>
						<center><input  type=submit value=" Upload " class = "regsubmit2"></center>
						</form>
		</td>
</tr>
<tr>
		<td bgcolor = "DBF5F2"><form action= 'RemoveHeader2.asp?EventID=<%=Session("EventID")%>' method = "post">
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<center><input type=submit value="Remove" class = "regsubmit2"></center></td>
	</tr></form>
</table>
</td>
<td>
<table cellpadding = "0" cellspacing = "0" border = "0">
	<tr><td  class = "body" bgcolor = "white" height = "40">
			 <a name = "images">
			<h2>Logo
			<% If Len(logo) > 1 then%>
				<img src = "<%= logo%>" height = "25">
			<% End If %></h2>
								 
	</td></tr>
	<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadLogohandle2.asp?EventID=<%=Session("EventID")%>" >
	<tr><td class = "body"  bgcolor = "#DBF5F2" >
						
						<% If Logo = "ImageNotAvailable.jpg" Then %>
								Current Logo Image Name: Not Defined<br>
						<% End If %>

						Upload Logo: <input name="attach1" type="file" size=45 ><br>
						<center><input  type=submit value="  Upload " class = "regsubmit2"></center></form>
	</td></tr>
	<tr>
		<td align= "center"  bgcolor = "DBF5F2">
			<form action= 'RemoveLogo2.asp?EventID=<%=Session("EventID")%>' method = "post">
			<input type = "hidden" name="ImageID" value= "1" >
			<input type = "hidden" name="ID" value= "<%= ID %>" >
			<center><input type=submit value="Remove" class = "regsubmit2"></center>
			</form>
	
		</td>	
			</tr>
</table>
</td>
</tr>
<tr>
  <td valign = "top">
  <table width = "440" cellpadding = "0" cellspacing = "0" border = "0" align = "center">
<tr>
	 <td  class = "body" bgcolor = "white" height = "40" >
	 <form  name=HeaderTextForm method="post" action="LayoutImages.asp?EventID=<%=EventID%>&UpdateHeaderText=True">
	 <h2>Header Text</h2><font color = "#abacab"><i>(appears in the upper right hand corner of the menu)</i></font>:</b><br />
Show Event Name on Header: 
<% if ShowEventName = "Yes" Or ShowEventName = True Then %>
			Yes<input TYPE="RADIO" name="ShowEventName" Value = "Yes" checked>
			No<input TYPE="RADIO" name="ShowEventName" Value = "No" >
		<% Else %>
			Yes<input TYPE="RADIO" name="ShowEventName" Value = "Yes" >
			No<input TYPE="RADIO" name="ShowEventName" Value = "No" checked>
		<% End If %>


<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script> 

	  <textarea name="HeaderText" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= HeaderText%></textarea> </td>
	</tr>
	<tr><td colspan = "2" class = "body2" align = "center">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit" class = "Regsubmit2" >
	</form><br>
<br><br>
    </td>
    </tr>
    </table>
  </td>
<td valign = "top">
<table width = "440" cellpadding = "0" cellspacing = "0" border = "0" align = "center">
<tr>
	 <td  class = "body" bgcolor = "white" height = "40" >
			 
								<h2>Menu Background Image</h2>
								<% If Len(MenuBackgroundImage) > 4 and not(trim(MenuBackgroundImage) = "Image Not Defined" ) then %>
									<img src = "<%= MenuBackgroundImage%>" height = "20">
								<% End If %>
								 
		</td>
</tr>
<tr>
		<td class = "body" bgcolor = "DBF5F2">
						<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadMenuBackgroundImage.asp?EventID=<%=Session("EventID")%>" >
						<% If Logo = "ImageNotAvailable.jpg" Then %>
								Current Image Name: Not Defined<br>
						<% End If %>

						Upload Image: <input name="attach1" type="file" size=45 ><br>
						<center><input  type=submit value="  Upload " class = "regsubmit2" width = "200"></center>
						</form>
		</td>
		</tr>
		<tr>	
			<td align= "center" bgcolor = "DBF5F2">
					<form action= 'RemoveMenuBackgroundImage.asp?EventID=<%=Session("EventID")%>' method = "post">
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<center><input type=submit value="Remove" class = "regsubmit2"></center>
							</form>
				</td>	
			</tr>
			</table>
</td>
</tr>
</table>


	
<!-- #include virtual="Footer.asp" -->
 </Body>
</HTML>
