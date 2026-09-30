<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->


<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Event Registry</title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>
<body>

<% PeopleIDNeeded = True %>
<!--#Include file="Header.asp"-->

<!--#Include file="SponsorHeader.asp"-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.SponsorshipLevelName.value=="") {
themessage = themessage + " - Sponsorship Level Title \r";
}
if (document.AddForm.SponsorshipLevelPrice.value=="") {
themessage = themessage + " - Sponsorship Level Price \r";
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
 	'response.write("EventID = " & EventID & "<br/>") 
 	sql = "select * from SponsorshipLevels where EventID = " & EventID 
	'response.write("sql = " & sql & "<br/>")

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3  
	 
	if not rs.eof then
		'publish= rs("publish")
		
		SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName = rs("SponsorshipLevelName")
		SponsorshipLevelDescription = rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice= rs("SponsorshipLevelPrice")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")
		str1 = SponsorshipLevelName
		str2 = "&nbsp;"
		
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelName= Replace(str1,  str2, " ")
		End If 

		str1 = SponsorshipLevelName
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelName= Replace(str1,  str2, "'")
		End If 

	End if 
%>

<a name="Top"></a>
<form name = "AddForm" action= 'SponsorPagedataPageHandleForm.asp?EventID=<%=EventID%>' method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Add a Sponsorship Level</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
	 <tr>
 <td class = "body2" colspan  "2">* = required field<br>
 </tr>
 <tr>
  	<td class = "body2"><img src = "images/px.gif" height = "1" width = "80" ><small>Title: *&nbsp;</small><input name="SponsorshipLevelName"  size = "45" ></td>
   </tr>
 <tr>
 <td >
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr >
  <td class = "body2" valign = "top" >
  <table>
  
    <tr>
  	<td class = "body2" align = "right" ><small>Price: *</small></td>
  	<td> $<input class="positive" type="text" name = "SponsorshipLevelPrice" size = 4 maxsize = 5 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr> 
  	
  	
  	<tr>
  	<td class = "body2" align = "right"><small>QTY Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "SponsorshipLevelQTYAvailable" size = 3 maxsize = 3 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	
	
  	 <tr>
  	<td class = "body2" align = "right"><small>Max QTY Per Sponsor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "SponsorshipLevelMaxQtyPer" size = 3 maxsize = 4 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	
	
	
	
	
	</table>
</td>
 <td class = "body2"><small>Description:</small><br><TEXTAREA NAME="SponsorshipLevelDescription" cols="85" rows="5" wrap="file"></textarea></td>
  </tr>
  <tr>
  <td class = "body2" colspan = "2" align = "center">
    <input type=button value="Add Sponsorship Level"  class = "regsubmit2" onclick="verify();">
</td>
</tr>
 </table>
</td>
</tr>
 </table>

</form>




<%
	row = "odd"
	rowcount = 1
	sql = "select * from SponsorshipLevels  where EventID = " & EventID
	
	'response.write (sql)
	    Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>

<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" ><a name = "Edit"></a><big><b>Edit Sponsorship Levels</b></big><br>
 * = required field<br>
</td>
 </tr>


<form action= 'SponsorPagedataPageHandleForm.asp' method = "post">
<input name="Action"  size = "60" value = "Update" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">




	
<% 	While Not rs.eof  
	
	SponsorshipLevelID = rs("SponsorshipLevelID")
	SponsorshipLevelName = rs("SponsorshipLevelName")
	SponsorshipLevelDescription = rs("SponsorshipLevelDescription")
	SponsorshipLevelPrice= rs("SponsorshipLevelPrice")
	SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
    SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")
	%>
<%  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0"  width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "#DBF5F3">
<% Else %>
	<table border = "0" width = "940"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "#fdf4dd">
<% End If %>
 <tr>
  	<td class = "body2" colspan = "2"><img src = "images/px.gif"  height = "1" width = "80"><small>Title: *&nbsp;</small><input name="SponsorshipLevelName(<%=rowcount%>)"  size = "45" value= "<%= SponsorshipLevelName %>">
  		<input type = "hidden" name="SponsorshipLevelID(<%=rowcount%>)" value= "<%= SponsorshipLevelID %>" ></td>
   </tr>
   
 <tr >
  <td class = "body2" valign = "top">
  <table>
   
    <tr>
  	<td class = "body2" align = "right"><small>Price:&nbsp;*</small></td>
  	<td> $<input class="positive" type="text" name = "SponsorshipLevelPrice(<%=rowcount%>)" size = 4 maxsize = 5 value= "<%= SponsorshipLevelPrice %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right"><small>QTY Available:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "SponsorshipLevelQTYAvailable(<%=rowcount%>)" size = 3 maxsize = 4 value= "<%= SponsorshipLevelQTYAvailable %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	
	
	<tr>
  	<td class = "body2" align = "right" ><small>Max QTY Per Sponsor:</small></td>
  	<td class = "body2" ><input class="positive" type="text" name = "SponsorshipLevelMaxQtyPer(<%=rowcount%>)" size = 3 maxsize = 4 value= "<%= SponsorshipLevelMaxQtyPer %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
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
 <td class = "body2"><small>Description:</small><br>
 <TEXTAREA NAME="SponsorshipLevelDescription(<%=rowcount%>)" cols="85" rows="5" wrap="file" ><%= SponsorshipLevelDescription %></textarea></td>
  </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
<tr><td colspan = "4" align = "center"><input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "Update Sponsor Levels" >
</td></tr></table>

</form>
<% end if %>

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>