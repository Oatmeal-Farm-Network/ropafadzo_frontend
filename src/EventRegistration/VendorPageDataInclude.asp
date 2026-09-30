<% 
sql = "select * from Services where ServiceTypeLookupID = 3 and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	MaxDate =  rs("MaxDate")
	if MaxDate = "True" then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 

%>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>



<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.VendorStallName.value=="") {
themessage = themessage + " - Vendor Stall Title \r";
}
if (document.AddForm.VendorStallPrice.value=="") {
themessage = themessage + " - Vendor Stall Price \r";
}


//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.AddForm.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>




<% 

 EventID = request.querystring("EventID") 
 sql = "select * from VendorLevels where EventID = " & EventID & ""
'response.write(sql)

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
VendorLevelID = rs("VendorLevelID")
VendorStallName = rs("VendorStallName")
VendorStallDescription = rs("VendorStallDescription")
VendorStallPrice= rs("VendorStallPrice")


str1 = VendorStallName
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	VendorStallName= Replace(str1,  str2, " ")
End If 

str1 = VendorStallName
str2 = "''"
If InStr(str1,str2) > 0 Then
	VendorStallName= Replace(str1,  str2, "'")
End If 

end if 
%>

<a name="Top"></a>
<form name = "AddForm" action= 'VendorStallsHandleForm.asp' method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
 <td class = "body2" colspan = "2"><big><b>Add a Vendor Option:</b></big><br>
 * = required field<br>
 </td>
 </tr><tr>
 <td >
<table border = "0" bordercolor = "#DBF5F3" bgcolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 
 <tr>
  	<td class = "body2" align = "left" colspan = "2"><img src =" images/px.gif" width = "80" height = "1"><small>Title: *<small><input name="VendorStallName"  size = "45" ></small></td>
   </tr>
 
 <tr bgcolor = "#DBF5F3">
  <td class = "body2" valign = "top" bgcolor = "#DBF5F3">
  <table bgcolor = "#DBF5F3" cellpadding = "0" cellspacing = "0" >
    <tr>
  	<td class = "body2" align = "right"><small>Price:*</small></td>
  	<td><small>$</small><input class="positive" type="text" name = "VendorStallPrice" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right"><small>QTY Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallQTYAvailable" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	  	 <tr>
  	<td class = "body2" align = "right"><small>Max QTY Per Vendor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallMaxQtyPer" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>

	<tr>
	  <td class = "body2" align = "right"><small>Power Available?:</small></td>
  		<td class = "body2" >
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="VendorStallPower" Value = "No" checked>
		</td>
	</tr>
	</table>
</td>
 <td class = "body2"><small>Description:</small><br><TEXTAREA NAME="VendorStallDescription" cols="90" rows="4" wrap="file"></textarea></td>
  </tr>
  <tr>
  <td class = "body2" colspan = "2" align = "center">
  <input type=button value="Add Booth Option"  class = "regsubmit2" onclick="verify();">
  

</td>
</tr>
 </table>
</td>
</tr>
 </table></form>






<%
row = "odd"
rowcount = 1
 sql = "select * from VendorLevels  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>


<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan = "2"><big><b><a name = "Edit"></a>Edit Vendor Booth Options:</b></big><br>
 * = required field<br>
</td>
 </tr>


<form action= 'VendorStallsHandleForm.asp' method = "post">
<input name="Action"  size = "60" value = "Update" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

	
<%	While Not rs.eof  
	
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallPrice= rs("VendorStallPrice")
	VendorStallQTYAvailable = rs("VendorStallQTYAvailable")
	VendorStallPower = rs("VendorStallPower")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	%>
<%  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "940"  align = "center" bgcolor = "#DBF5F3">
	<tr><td>
<% Else %>
	<table border = "0" width = "940"  align = "center" bgcolor = "#DBF5F3" >
	<tr><td>
<% End If %>
	<table border = "0" width = "940"  align = "center" >
 <tr>
  	<td class = "body2" colspan = "2"><small>Title:*</small><input name="VendorStallName(<%=rowcount%>)"  size = "45" value= "<%= VendorStallName %>">
  		<input type = "hidden" name="VendorLevelID(<%=rowcount%>)" value= "<%= VendorLevelID %>" ></td>
   </tr>
 <tr bgcolor = "white">
  <td class = "body2" valign = "top">
  <table>
   
    <tr>
  	<td class = "body2" align = "right"><small>Price:*</small></td>
  	<td> $<input class="positive" type="text" name = "VendorStallPrice(<%=rowcount%>)" size = 4 maxsize = 5 value= "<%= VendorStallPrice %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right"><small>QTY Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallQTYAvailable(<%=rowcount%>)" size = 2 maxsize = 3 value= "<%= VendorStallQTYAvailable %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	  	 <tr>
  	<td class = "body2" align = "right"><small>Max QTY Per Vendor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallMaxQtyPer(<%=rowcount%>)" size = 2 maxsize = 3 value= "<%= VendorStallMaxQtyPer %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>

	
	
	
	
	<tr>
	  <td class = "body2" align = "right"><small>Power Available?:</small></td>
  		<td class = "body2" >
  		<% if VendorStallPower = True then %>
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower(<%=rowcount%>)" Value = "Yes" checked>
		<small>No</small><input TYPE="RADIO" name="VendorStallPower(<%=rowcount%>)" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower(<%=rowcount%>)" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="VendorStallPower(<%=rowcount%>)" Value = "No" checked>
		<% end if %>
		</td>
	</tr>

	<tr>
	  <td class = "body2" align = "right" ></td>
  		<td class = "body2"bgcolor = "brown" >
		<input TYPE="checkbox" name="Delete(<%=rowcount%>)" Value = "Yes" ><font color = "white">Delete</font>
		</td>
	</tr>

	
	
	
	</table>
</td>
 <td class = "body2"><small>Description:</small><br><TEXTAREA NAME="VendorStallDescription(<%=rowcount%>)" cols="85" rows="6" wrap="file" ><%= VendorStallDescription %></textarea></td>
  </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
<tr><td colspan = "4" align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "Update Vendor Booths" >
</td></tr></table>
</td></tr></table>
</td></tr></table>
</form>
<% end if %>


<br><br><br>
<div align = "center"><a href = "#Top" class ="body">Click here to go to the top of the page.</a></center>