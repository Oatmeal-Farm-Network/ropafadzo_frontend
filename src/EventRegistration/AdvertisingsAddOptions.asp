<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Advertising Options</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="globalVariables.asp"--> 
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="AdvertisingHeader.asp"--> 

<% 

sql = "select * from Services, ServicetypeLookup where Services.ServiceTypeLookupID = ServicetypeLookup.ServiceTypeLookupID and ServicetypeLookup.ServiceType = 'Advertising' and EventID =  " & EventID & " Order by ServicesID Desc"
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
if (document.AddForm.AdvertisingStallName.value=="") {
themessage = themessage + " - Advertising Stall Title \r";
}
if (document.AddForm.advertisingStallPrice.value=="") {
themessage = themessage + " - Advertising Stall Price \r";
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
sql = "select * from AdvertisingLevels where EventID = " & EventID & ""
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
AdvertisingLevelID = rs("AdvertisingLevelID")
AdvertisingLevelPrice= rs("AdvertisingLevelPrice")


str1 = AdvertisingLevelName
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName= Replace(str1,  str2, " ")
End If 

str1 = AdvertisingLevelName
str2 = "''"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName= Replace(str1,  str2, "'")
End If 

end if 
Submitted= request.QueryString("Submitted")
if Submitted= "True" then
    MissingPrice = request.QueryString("MissingPrice")
    MissingName = request.QueryString("MissingName")
end if
        
%>
 <% PageTitleText =  "Add an Advertising Option" %>
<!--#Include file="970Top.asp"-->
<a name="Top"></a>
<form name = "AddForm" action= "AdvertisingOptionsAddHandleForm.asp?EventID=<%=EventID%>" method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >

    <tr><td class = "body2" >
    <b>* = required field</b><br>
    
    <%
    AdvertisingLevelPrice = request.querystring("AdvertisingLevelPrice")
AdvertisingLevelName = request.querystring("AdvertisingLevelName")
AdvertisingLevelQTYAvailable =request.querystring("AdvertisingLevelQTYAvailable")
AdvertisingDimensions= request.querystring("AdvertisingDimensions")
AvaliableWithSponsorships= request.querystring("AvaliableWithSponsorships")
AvaliableByItself= request.querystring("AvaliableByItself")
AdvertisingLocation = request.querystring("AdvertisingLocation")



     if Submitted= "True" then
if MissingPrice = "True" or  MissingName = "True" then %>  
  <font color = "red">The data that you entered has issues. Please fix them and resubmit the form:<ul>
      <% if MissingPrice = "True" then %>
            <li>Please enter a valid price.</li>
      <% end if %>
            <% if MissingName = "True" then %>
            <li>Please enter a valid title.</li>
      <% end if %>
        </font>
<% else %>  
Your advertising option have been added. To edit advertising options please select <a href = "AdvertisingEditPageData.asp?EventID=<%=EventID%>#Options" class = "body">Edit Advertising Options</a><br>

<% end if %>
<% end if %>

</td></tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
  	<td class = "body2" align = "right" ><% if Submitted= "True" and MissingName="True" then%><font color = "brown"><% end if %>Title:*<% if Submitted= "True" and MissingName="True" then%></font><% end if %></td>
  	<td class = "body2" ><input name="AdvertisingLevelName"  size = "45" value="<%= AdvertisingLevelName%>" ></td>
  </tr>
 <tr >
 <tr>
  	<td class = "body2" align = "right"><% if Submitted= "True" and MissingPrice="True" then%><font color = "brown"><% end if %>Price:*<% if Submitted= "True" and MissingPrice="True" then%></font><% end if %></td>
  	<td class = "body2"><small>$</small><input class="positive" type="text" name = "AdvertisingLevelPrice" size = 7 maxsize = 9  value="<%= AdvertisingLevelPrice%>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
</tr>
 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingLevelQTYAvailable" size = 7 maxsize = 9  value="<%= AdvertisingLevelQTYAvailable%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right">Avaliable With Sponsorships?:</td>
  		<td class = "body2" >
  			<% if AvaliableWithSponsorships ="No" then %>
		Yes<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" >
		No<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" checked>
 <% else %>
Yes<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" >
	   <% end if %>
		</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right">Avaliable for Purchase By Itself?:</td>
  		<td class = "body2" >
  		<% if AvaliableByItself ="No" then %>
  				Yes<input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" >
		        No<input TYPE="RADIO" name="AvaliableByItself" Value = "No" checked>
		 <% else %>
		Yes<input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableByItself" Value = "No" >
	   <% end if %>
	   </td>
	</tr>
<tr>
		<td class = "body2" align = "right">
			Advertising Location:</td>
		<td>
		<select size="1" name="AdvertisingLocation">
		<% if len(AdvertisingLocation) > 1 then %>
			<option value="<%=AdvertisingLocation %>"><%=AdvertisingLocation %></option>
		<% end if %>
					<option value="Show Program">Show Program</option>
					<option  value="Website">Website</option>
					<option  value="Show Packett">Show Packett</option>
		</select>
</td>
</tr>



<tr>
  	<td class = "body2" align = "right">Advertisement Dimensions:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingDimensions" size = 15 maxsize = 20 value='<%= AdvertisingDimensions%>' >
	</td>
</tr>
<tr>
  <td class = "body2" colspan = "2" align = "center">
  <input type=submit value="Add an Advertising Option"  class = "regsubmit2" >
</td>
</tr>
 </table>
</form>


<!--#Include file="970Bottom.asp"-->
<br><br><br>
<div align = "center"><a href = "#Top" class ="body">Click here to go to the top of the page.</a></div>

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
