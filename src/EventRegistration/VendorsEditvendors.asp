<%@ Language="VBScript" %> 
	

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Vendors</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<% PeopleIDNeeded = True %>
<!--#Include file="Header.asp"-->


<!--#Include file="ClassesHeader.asp"-->
<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body"><br>
			<H2>Edit Instructors </H2>
		</td>
	</tr>
		<tr><td class = "Menu2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
		<tr><td class = "Menu2" colspan  "3" height = "1">
		
		 <% sql = "select * from VendorLevels  where EventID = " & EventID 

response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any vendor options listed. To add vendors option please select  <a href = "Vendorspagedata.asp?EventID=<%=EventID%>" class = "menu2">Add Vendor Options</a>. 
		
	<% else %>	
		
		Below are a list of the vendor options that your have for your event:
		
		
	<% end if %>
		</td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"


'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="Menu2" align = "center" width= "100">
	      
	     </td>
	     <td class="Menu2" align = "center" width = "150">
	       <b>Title</b>
	     </td>
	     <td class="Menu2" align = "center" width = "150">
	       <b>Price</b>
	     </td>
	     <td class="Menu2" align = "center">
	       <b>Actions</b>
	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	
	<% end if
	order = "odd"
	While Not rs.eof  
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	response.write("VendorLevelName = " & VendorLevelName )
	VendorStallPrice = rs("VendorStallPrice")
	%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="VendorLevelID" value= "<%= VendorLevelID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	  <td class="Menu2" align = "center" height = "40">
	
	     </td>
	     <td class="Menu2">
	       <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>" class="Menu2"><%=VendorStallName%></a>
	     </td>
	     <td class="Menu2" >
	       <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>" class="Menu2"><%=VendorStallPrice%></a>
	     </td>
     	<td class="Menu2" align = "center">
	      <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Vendor Option"></a>  
	      <a href = "VendorStallsHandleForm.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Vendor Option"></a>

	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<br>
<table width = "900" align = "center">
   <tr><td class="Menu2" align = "center"><b><i>Note: To add vendors option please select  <a href = "Vendorspagedata.asp?EventID=<%=EventID%>" class = "menu2">Add Vendor Options</a></i></b>
   </td>
   </tr>
   </table>
	
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>