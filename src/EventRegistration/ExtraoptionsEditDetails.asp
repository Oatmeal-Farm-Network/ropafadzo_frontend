<html>
<head>

<!--#Include virtual="GlobalVariables.asp"-->
<% ExtraOptionsID = request.querystring("ExtraOptionsID")
ExtraOptionsName = request.querystring("ExtraOptionsName")
%>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Edit Extra Option</title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
 
</head>
<body>

<!--#Include file="Header.asp"-->
<!--#Include file="ExtraOptionsHeader.asp"-->






<br>
<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan  "2"><big><b>Edit <%=ExtraOptionsName %></b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>

<% Message = "" %>
<%Message = request.querystring("Message")%>
<%if len(Message) > 1 then %>
	<table border = "0" bordercolor = "#DBF5F3" cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<tr>
	 <td class = "body2" ><font color = "red"><%=Message%></font>
	 </td>
	 </tr>
	</table>
<% end if %>

<% 
	
  	'response.write("ExtraOptionsID = " & ExtraOptionsID & "<br>")
  	sql = "select * from ExtraOptions where ExtraOptionsID = " & ExtraOptionsID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		'publish= rs("publish")
		ExtraOptionsID = rs("ExtraOptionsID")
		ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsPrice = rs("ExtraOptionsPrice")
		ExtraOptionsQTYAvailable = rs("ExtraOptionsQTYAvailable")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		AvaliableWithSponsorships = rs("AvaliableWithSponsorships")
		AvaliableByItself = rs("AvaliableByItself")
		ExtraOptionsID = rs("ExtraOptionsID")
		
		
		str1 = ExtraOptionsTitle
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsTitle= Replace(str1,  str2, " ")
		End If 
		
		str1 = ExtraOptionsTitle
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsTitle= Replace(str1,  str2, "'")
		End If 
	end if 
%>
<SCRIPT LANGUAGE="JavaScript"  type="text/javascript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.ExtraOptionsTitle.value=="") {
themessage = themessage + " - Class Title \r";
}
if (document.AddForm.ExtraOptionsStudentFee.value=="") {
themessage = themessage + " - Class Price \r";
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

<a name="Edit">
<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ExtraOptions  where ExtraOptionsID = " & ExtraOptionsID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<tr>
 		<td class = "body2" width = "200">* = required field<br>
		</td>
 	</tr>

	<form action= 'ExtraOptionsEditHandleForm.asp?EventID=<%=EventID%>' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="ExtraOptionsID"  size = "60" value = "<%=ExtraOptionsID%>" type = "hidden">
<% 	
	rowcount = 1
	While Not rs.eof %>
	

	
	
	<%	ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsPrice = rs("ExtraOptionsPrice")
		ExtraOptionsQTYAvailable = rs("ExtraOptionsQTYAvailable")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		AvaliableWithSponsorships = rs("AvaliableWithSponsorships")
		AvaliableByItself = rs("AvaliableByItself")
		ExtraOptionsID = rs("ExtraOptionsID")

		 %>
			
			<table border = "0" width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "white">
 
		<tr >
  			<td class = "body2" valign = "top" >
  			<table>
  			<tr>
  				<td class = "body2"  align = "right" valign = "top">Title: *</td>
  				<td class = "body2" ><input name="ExtraOptionsName"  size = "45" value="<%=ExtraOptionsName%>"></td></tr>
   		
    <tr>
  	<td class = "body2" align = "right" valign = "top">Price (Value): *</td>
  	<td class = "body"> $<input class="positive" type="text" name = "ExtraOptionsPrice" size = 7 maxsize = 9 value = "<%=ExtraOptionsPrice%>">
  	<br><i>For free please enter "0" for the price.</i>

	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "ExtraOptionsQTYAvailable" size = 7 maxsize = 9 value="<%=ExtraOptionsQTYAvailable%>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
<tr>
	  <td class = "body2" align = "right"><small>Avaliable With Sponsorships?:</small></td>
  		<td class = "body2" >
  		<% if AvaliableWithSponsorships = True then %>
		<small>Yes</small><input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" checked>
		<% end if %>
		</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right"><small>Avaliable By Itself?:</small></td>
  		<td class = "body2" >
  		<% if AvaliableByItself = True then %>
		<small>Yes</small><input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" checked>
		<small>No</small><input TYPE="RADIO" name="AvaliableByItself" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="AvaliableByItself" Value = "No" checked>
		<% end if %>
		</td>
	</tr>


	</table>
</td>

<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


<script language="javascript1.2">
  // attach the editor to the textarea with the identifier 'textarea1'.
   WYSIWYG.attach("1");
</script>



<% 'response.write("rowcount = " & rowcount & "ExtraOptionsDescription" & ExtraOptionsDescription & "<br>")%>
 <td class = "body2">

 
 Description:<br><TEXTAREA NAME="ExtraOptionsDescription" cols="58" rows="18" wrap="file" ID="1" ><%=ExtraOptionsDescription%></textarea><br>
 
 </td>
</tr>
</table>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</td></tr></table>
<tr><td colspan = "4" align = "center"><input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<center>
	<br>
    <input type="submit" value="Update Extra Option"  class = "regsubmit2" >

</center>
	
	


</form>
<% end if %>



<br>
<table width = "900" align = "center">
   <tr><td class="Menu2" align = "center"><b><i>Note: To edit ExtraOptions please <a href="ExtraOptionsEdit.asp?EventID=<%=eventid%>" class="menu2">click here</a></i></b>
   </td>
   </tr>
   </table>

<br><br><br>

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>