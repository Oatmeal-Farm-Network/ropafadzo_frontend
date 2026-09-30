<!DOCTYPE HTML >

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Vendor Facts</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="globalVariables.asp"--> 
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="VendorsHeader.asp"--> 

<% 
sql = "select * from Services where ServiceTypeLookupID = 3 and EventID =  " & EventID & " Order by ServicesID Desc"
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
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
VendorLevelID = rs("VendorLevelID")
VendorStallName = rs("VendorStallName")
VendorStallDescription = rs("VendorStallDescription")
VendorStallPrice= rs("VendorStallPrice")
Numfreetables = rs("Numfreetables")
Costpertable=  rs("Costpertable")
MaxExtraTables = rs("MaxExtraTables")
VendorStallMaxQtyPer =rs("VendorStallMaxQtyPer")

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
 <% PageTitleText =  "Add a Vendor Booth Option" %>
<!--#Include file="970Top.asp"-->
<form name = "AddForm" action= "VendorStallsHandleForm.asp?EventID=<%=EventID%>" method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
    <tr><td class = "body"  >
    <% 
    
    VendorStallName= Request.Querystring("VendorStallName")
VendorStallDescription = Request.Querystring("VendorStallDescription")
VendorStallPrice= Request.Querystring("VendorStallPrice") 
VendorStallQTYAvailable =Request.Querystring("VendorStallQTYAvailable")
VendorStallPower= Request.Querystring("VendorStallPower")
VendorStallMaxQtyPer= Request.Querystring("VendorStallMaxQtyPer")
Numfreetables = Request.Querystring("Numfreetables")
Costpertable= Request.Querystring("Costpertable")
MaxExtraTables= Request.Querystring("MaxExtraTables")
DuplicateName= Request.Querystring("DuplicateName")
PriceFound= Request.Querystring("PriceFound")
VendorStallNameFound= Request.Querystring("VendorStallNameFound")

    
    Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red"><b><%=Message %> </b></font> <br />To edit vendor booth options please select <a href = "VendorsEditPageData.asp?EventID=<%=EventID%>#Vendors" class = "body">Edit Vendor Options</a><br>

<% end if %>


 * = required field<br></td></tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 
 <tr>
  	<td class = "body2" align = "right" width = "350">

  	
  	<% if DuplicateName="True"  or VendorStallNameFound="False" then %><font color = "red"><b><% end if %>Title:*<% if DuplicateName="True" or VendorStallNameFound="False" then %></font "></b><% end if %></td>
  	<td class = "body2" colspan = "2" ><input name="VendorStallName" value="<%= VendorStallName%>"  size = "45" ></td>

   </tr>
 </table>
 <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >

 <tr >
  <td class = "body2" valign = "top" width = "450">
  <table  cellpadding = "0" cellspacing = "0" width = "450">
    <tr>
  	<td class = "body2" align = "right" width = "350"><% if PriceFound="False" then %><font color = "red"><b><% end if %>Price:*<% if PriceFound="False" then %></font "></b><% end if %></td>
  	<td><small>$</small><input class="positive" type="text" name = "VendorStallPrice" value = "<%=VendorStallPrice%>" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right"><small>Quantity Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallQTYAvailable"  value = "<%= VendorStallQTYAvailable%>" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	<tr>
  	<td class = "body2" align = "right"><small>Max Quantity Per Vendor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "VendorStallMaxQtyPer" value = "<%= VendorStallMaxQtyPer%>" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>

	<tr>
	  <td class = "body2" align = "right"><small>Power Available?:</small></td>
  		<td class = "body2" >
  		<% if VendorStallPower = Yes then %>
  		
		<small>Yes</small><input TYPE="RADIO" name="VendorStallPower" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="VendorStallPower" Value = "No" checked>
		<% else %>
			<small>Yes</small><input TYPE="RADIO" name="VendorStallPower" Value = "Yes" checked>
		<small>No</small><input TYPE="RADIO" name="VendorStallPower" Value = "No" >
		<% end if %>
		</td>
	</tr>
	<tr>
  	<td class = "body2" align = "right"><small>Number of Tables That Come With This Option:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "Numfreetables" value = "<%=Numfreetables%>" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
<tr>
  	<td class = "body2" align = "right"><small>Cost Per Additional Table:</small></td>
  	<td><small>$</small><input class="positive" type="text" name = "Costpertable" value = "<%=Costpertable%>" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
<tr>
  	<td class = "body2" align = "right"><small>Maximum Number of Extra Tables: </small></td>
  	<td><input class="positive" type="text" name = "MaxExtraTables" value = "<%=MaxExtraTables %>" size = 7 maxsize = 9 >
  	
	
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
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
 <b>Description:</b>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script> 

<TEXTAREA NAME="VendorStallDescription" cols="58" rows="18" wrap="file" id="textarea1"><%=VendorStallDescription %></textarea></td>
  </tr>
  <tr>
  <td class = "body2" colspan = "2" align = "center">
  <center><input type=submit value="Add Vendor Booth Option"  class = "regsubmit2" ></center>
  

</td>
</tr>
 </table>
</form>



<!--#Include file="970Bottom.asp"-->
<br />
<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
