<!DOCTYPE HTML>

<%@ Language=VBScript %>

<HTML>
<HEAD>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Vendor Facts</title>
<link rel="stylesheet" type="text/css" href="style.css">
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="globalVariables.asp"--> 
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="VendorsHeader.asp"--> 




<% 

 EventID = request.querystring("EventID") 
VendorLevelID = request.querystring("VendorLevelID") 
if len(VendorLevelID) > 0 then
row = "odd"
rowcount = 1
 sql = "select * from VendorLevels  where EventID = " & EventID & " and VendorLevelID = " & VendorLevelID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    
    VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallPrice= rs("VendorStallPrice")
	VendorStallQTYAvailable = rs("VendorStallQTYAvailable")
	VendorStallPower = rs("VendorStallPower")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	Numfreetables = rs("Numfreetables")
Costpertable=  rs("Costpertable")
MaxExtraTables = rs("MaxExtraTables")
    %>
    
 <% PageTitleText = "Edit " & VendorStallName  %>
<!--#Include file="970Top.asp"-->
    <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >

	 <tr><td   class = "menu2" colspan ="2"><img src = "images/px.gif" width = "20" height = "20" >
	 <a href = "Vendorspagedata.asp?EventID=<%=eventID%>" class = "menu2">Add Vendor Options</a> |
     <a href = "VendorsEditPageData.asp?EventID=<%=eventID%>#VendorOptions" class = "menu2">Edit Vendor Options</a> 
     <% shovendorsadd = false 
     if shovendorsadd = true then %>
 	 <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a> |&nbsp; 
 	 <a href = "VendorEdit.asp?EventID=<%=eventID%>#Vendors" class = "menu2">Edit Vendor</a>
 	 <% end if %>
 	 </td>
</tr>
</table>

<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr><td class = "body2"  >
<% Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red"><%=Message %></font><br>
<% end if %>
 <br></td>
 <td class = "body2">
 
 </td>
 </tr>
</table>


<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan = "2">
 
<form action= 'VendorStallsHandleForm.asp?EventID=<%=EventID%>' method = "post">
<input name="Action"  size = "60" value = "Update" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

	
<table border = "0" width = "940"  align = "center" >
	<tr><td>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
  	<td class = "body2" align = "right" width = "330"></td>
  	<td class = "body2" colspan = "2" >* = required field</td></tr>


 <tr>
  	<td class = "body2" align = "right" width = "330">Title: *</td>
  	<td class = "body2" colspan = "2" ><input name="VendorStallName"  size = "45" value= "<%= VendorStallName %>">
  	<input name="VendorLevelID"  size = "60" value = "<%=VendorLevelID%>" type = "hidden"></td>

   </tr>
 </table>



	<table border = "0" width = "940"  align = "center" >
 <tr bgcolor = "white">
  <td class = "body2" valign = "top">
  <table>
   
    <tr>
  	<td class = "body2" align = "right" width = "350"><small>Price:*</small></td>
  	<td width = "100"> $<input class="positive" type="text" name = "VendorStallPrice" size = 4 maxsize = 5 value= "<%= VendorStallPrice %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right"><small>QTY Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallQTYAvailable" size = 2 maxsize = 3 value= "<%= VendorStallQTYAvailable %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	  	 <tr>
  	<td class = "body2" align = "right"><small>Max QTY Per Vendor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallMaxQtyPer" size = 2 maxsize = 3 value= "<%= VendorStallMaxQtyPer %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right"><small>Power Available?:</small></td>
  		<td class = "body2" >
  		<% if VendorStallPower = True then %>
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower" Value = "Yes" checked>
		<small>No</small><input TYPE="RADIO" name="VendorStallPower" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="VendorStallPower" Value = "No" checked>
		<% end if %>
		</td>
	</tr>
<tr>
  	<td class = "body2" align = "right"><small>Number of tables that come with Option:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "Numfreetables" size = 7 maxsize = 9 value= "<%= Numfreetables %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
<tr>
  	<td class = "body2" align = "right"><small>Cost per table:</small></td>
  	<td><small>$</small><input class="positive" type="text" name = "Costpertable" size = 7 maxsize = 9 value= "<%= Costpertable %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
<tr>
  	<td class = "body2" align = "right"><small>Max. Number of Extra Tables:</small></td>
  	<td><input class="positive" type="text" name = "MaxExtraTables" size = 7 maxsize = 9 value= "<%= MaxExtraTables %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
</table>
</td>
 <td class = "body2">
  <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
 <b>Description:</b>
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
<script language="javascript1.2">
// attach the editor to the textarea with the identifier 'textarea1'.
WYSIWYG.attach("<%=VendorLevelID%>");
</script> 

 
<TEXTAREA NAME="VendorStallDescription" cols="55" rows="18" wrap="file" id="<%=VendorLevelID%>" ><%= VendorStallDescription %></textarea></td>
  </tr>
  
<tr><td colspan = "4" align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "Update Vendor Option" class="regsubmit2">
</td></tr></table>
</td></tr></table>
</td></tr></table>
</form>
<% else %>

 <% PageTitleText = "Edit Vendor Options"%>
<!--#Include file="970Top.asp"-->
<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body"><a name="VendorOptions"></a><br>
		</td>
	</tr>
		<tr><td class = "Menu2" colspan  "3" height = "1">
		
		 <% sql = "select * from VendorLevels  where EventID = " & EventID 

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
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
		     <td class="Menu2" align = "center" width = "600">
	       <b>Title</b>
	     </td>
	     <td class="Menu2" align = "center" width = "70">
	       <b>Price</b>
	     </td>
	     <td class="Menu2" align = "center" width = "80">
	       <b>Actions</b>
	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	
	<%
	order = "odd"
	While Not rs.eof  
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
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
	     <td class="Menu2" width = "250">
	       <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>" class="Menu2"><%=VendorStallName%></a>
	     </td>
	     <td class="Menu2" align = "right">
	       <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>" class="Menu2" ><% IF LEN(VendorStallPrice) > 1 then %>
	       																												<%=formatcurrency(VendorStallPrice,2)%>
	       																											<% else %>
	       																												FREE
	       																											<% end if %></a><img src = "images/px.gif" width = "20" height = "10" alt = "price" border = "0">
	     </td>
     	<td class="Menu2" align = "center">
	      <a href = "VendorsEditPageData.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Vendor Option"></a>  
	      <a href = "VendorLevelDeleteHandleForm.asp?VendorLevelID=<%=VendorLevelID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Vendor Option"></a>

	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

<%  end if %>
<br>
<table width = "450" align = "center">
   <tr><td class="Menu2" align = "left"><b><i>To add vendors option please select  <a href = "Vendorspagedata.asp?EventID=<%=EventID%>" class = "menu2">Add Vendor Options</a></i></b>
   </td>
   </tr>
   </table>


<% end if %>
<br>

<!--#Include file="970Bottom.asp"-->

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
