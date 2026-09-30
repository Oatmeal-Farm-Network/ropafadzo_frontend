<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>

<%'Start meta tags%>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Oregon Alpacas - Alpacas for Sale at Andresen Acres in Southern Oregon</title>
<META name="Title" content="Oregon Alpacas - Alpacas for Sale at Andresen Acres in Southern Oregon">
<META name="description" content="Alpacas For Sale at Andresen Acres - raising quality alpaca livestock for sale and herdsires in the Northwset."/>
<META name="keywords" content="Alpacas for Sale,
Friendly Alpacas,
Quality Fleece, 
Oregon Alpacas,
Certified Fleece Sorter,
Fleece Sorting,
Alpaca Fleece Sorting, 
Raising Alpacas, 
Quality Herdsires, 
Quality Alpacas,
Quality Production Females, 
Northwest Alpacas, 
Oregon Farm, 
Alpaka, 
Alpacka, 
Livestock for Sale, 
Alpaca Breeders">
<meta name="robots" content="index,follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="revisit-after" content="1"/>
<meta name="Googlebot" content="index,follow"/>
<meta name="robots" content="All"/>
<meta name="subjects" content="Alpacas for Sale, Raising Alpacas, Oregon Livestock" />
<meta name="author" content="WebArtists.biz">
<%'End meta tags%>

<link rel="stylesheet" type="text/css" href="style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include virtual="Header.asp"-->

<!--#Include virtual="GlobalVariables.asp"-->
	

<table width = "800" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" valign = "top">
<tr><td class = "body" valign = "top">
<h1>Testimonials</h1>
</td></tr></table>

<table width = "800" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" valign = "top">
	<tr><td>
	<br><br>
	<table width = "700" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" valign = "top" >

<%   
sql = "select * from Testimonials order by AGCustID "

response.write("SQL = " & sql & "<br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3  
recordcount = rs.recordcount

while not rs.eof   %>     

	<tr>
		<td class = "body">
		<i>"<%=rs("Testimonial")%>"</i><br>

<div align ="Right">
<% if len(rs("Name")) > 3 then %>
	- <%=rs("Name")%><br>
<% end if %>

	<a href = "http://www.andresenacres.com/Details2.asp?ID=<%=rs("AGCustID")%>" class = "body" ><%=rs("CustomerName")%></a>
	
	
	<BR><br>
</div>
	</td>
	</tr>
<%
rs.movenext
wend


rs.close%>

	
</table>
</td>
</tr>
</table>
<br><br>




<!--#Include file="Footer.asp"-->
</body>
</html>