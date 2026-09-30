<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Event Halter" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<meta name="keywords" content="Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<link rel="shortcut icon" href="file:///infinityknot.ico" > 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" > 
<meta name="author" content="The Andresen Goup" >
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<!--#Include file="EventHeader.asp"-->

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Forms</h2></td>
	</tr>
	<tr>
		<td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
	<tr>
		<td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
</table>
 
 <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "<%=Textwidth%>" align = "center">
	<tr>
	   
 <td valign = "top">  
 

<% 

sql = "select * from EventPageLayout, EventPageLayout2  where EventPageLayout.PageLayoutID = EventPageLayout2.PageLayoutID and PageName = 'Forms' and  EventPageLayout.EventID =  " & EventID & " Order by  EventPageLayout.PageLayoutID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	Description = rs("PageText")
	PageLayoutID = rs("PageLayoutID")
	PageLayout2ID = rs("PageLayout2ID")
	Upload =  rs("Upload")
	'response.write("ipload=" & Upload )
str1 = PageText
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1, str2 , vbCrLf)
End If  


str1 = PageText
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, " ")
End If 

str1 = PageText
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, "'")
End If 

	
End If 


%>


 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "<%=Textwidth%>" align = "center" >
 <tbody>
	<tr>
	<td class= "body" width = "<%=Textwidth%>" valign = "top"> 

<%= Description%> <br>
</td></tr>
	


<%
dim PageLayout2IDarray(20)
dim Uploads(20) 
i = 0
sql = "select * from  EventPageLayout2  where PageLayoutID =" & PageLayoutID & "  order by BlockNum"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3 
if not rs.eof then %>

<tr>
 <td class = "body">
<h3>Show Forms</h3>
below are the forms for the show:
<ul>


 
<% while Not rs.eof 
  i = i + 1
	Uploads(i) =  rs("Upload")
	PageLayout2IDarray(i) = rs("PageLayout2ID")
rs.movenext
wend
totalcount = i

if len(Uploads(i-1)) > 1 then
Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  i + 1 & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		Conn.Execute(Query)

end if 

i = 0
while i < totalcount 
i = i + 1 %>
	
		<% if len(Uploads(i)) > 1 then 
		%>
			<li><a href = "<%=Uploads(i)%>" target = "blank"><%=right(Uploads(i), len(Uploads(i)) - 9)%></a></li>
		<% end if %>	
			


<% wend %>
</ul>
</td></tr>
<% end if 
%>

</table>
</td></tr>
</table>

 
<br><br>
 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

