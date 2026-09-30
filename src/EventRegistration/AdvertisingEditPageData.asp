<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Edit Advertising Option</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="globalVariables.asp"--> 
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="AdvertisingHeader.asp"--> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


 <% PageTitleText =  "Edit Advertising Options" %>
<!--#Include file="970Top.asp"-->
<% 

 EventID = request.querystring("EventID") 
AdvertisingLevelID= request.querystring("AdvertisingLevelID") 
row = "odd"
rowcount = 1
if len(AdvertisingLevelID) > 0 then


 sql = "select * from AdvertisingLevels  where AdvertisingLevelID = " & AdvertisingLevelID
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    if  rs.eof then %>
    <table border = "0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
    <tr><td class = "body2"  >No Advertising options have been added yet. To add Advertising options please select <a href = "AdvertisingsAddOptions.asp" class = "body">Add Advertising options</a>.</td></tr>
</table>


<% end if 
  
if not rs.eof then %>


<table border = "0"   cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan = "2"><br><big><b><a name = "Edit"></a>Edit Advertising Options:</b></big></td>
 </tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
    <tr><td class = "body2"  >
<% Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red"><%=Message %></font><br>

<% end if %>
 * = required field<br></td></tr>
</table>


<table border = "0"    cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan = "2">
 
<form action= 'AdvertisingOptionsHandleForm.asp?EventID=<%=EventID%>' method = "post">
<input name="Action"  size = "60" value = "Update" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

	
<%	
	
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelDescription = rs("AdvertisingLevelDescription")
	AdvertisingLevelPrice= rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertisingDimensions= rs("AdvertisingDimensions")
	AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
	AvaliableByItself= rs("AvaliableByItself")
	AdvertisingLocation= rs("AdvertisingLocation")

	%>
	
	<table border = "0" width = "940"  align = "center" >
 
 <tr bgcolor = "white">
  <td class = "body2" valign = "top">
  <table>
   <tr>
  	<td class = "body2" align = "right">Title:*</td>
  	<td class = "body2"><input name="AdvertisingLevelName"  size = "30" value= "<%= AdvertisingLevelName %>">
  		<input type = "hidden" name="AdvertisingLevelID" value= "<%= AdvertisingLevelID %>" ></td>
   </tr>
    <tr>
  	<td class = "body2" align = "right">Price:*</td>
  	<td> $<input class="positive" type="text" name = "AdvertisingLevelPrice" size = 4 maxsize = 5 value= "<%= AdvertisingLevelPrice %>">
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
  	</tr>
  	 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingLevelQTYAvailable" size = 2 maxsize = 3 value= "<%= AdvertisingLevelQTYAvailable %>">
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	
		<tr>
	  <td class = "body2" align = "right">Avaliable With Sponsorships?:</td>
  		<td class = "body2" >
  		<% if AvaliableWithSponsorships = True then %>
		Yes<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" >
		<% else %>
		Yes<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" >
		No<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" checked>
		<% end if %>
		</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right">Avaliable for Purchase By Itself?:</td>
  		<td class = "body2" >
  		<% if AvaliableByItself = True then %>
		Yes<input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableByItself" Value = "No" >
		<% else %>
		Yes<input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" >
		No<input TYPE="RADIO" name="AvaliableByItself" Value = "No" checked>
		<% end if %>
	
		</td>
	</tr>
<tr>
		<td class = "body2" align = "right">
			Advertising Location:</td>
		<td>
		<select size="1" name="AdvertisingLocation">
		<% if len(AdvertisingLocation) > 1 then %>
				<option value="<%=AdvertisingLocation%>"><%=AdvertisingLocation%></option>
		<% end if %>		
					<option value="Show Program">Show Program</option>
					<option  value="Website">Website</option>
					<option  value="Show Packett">Show Packett</option>
		</select>
</td>
</tr>



<tr>
  	<td class = "body2" align = "right">Advertising Dimensions:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingDimensions" size = 8 maxsize = 20 value= "<%= AdvertisingDimensions %>">
	
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

<script language="javascript1.2">
// attach the editor to the textarea with the identifier 'textarea1'.
WYSIWYG.attach("<%=AdvertisingLevelID%>");
</script> 

 
<TEXTAREA NAME="AdvertisingLevelDescription" cols="85" rows="6" wrap="file" id="<%=AdvertisingLevelID%>" ><%= AdvertisingLevelDescription %></textarea></td>
  </tr>
  
<tr><td colspan = "4" align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "Update Advertising Options" class="regsubmit2">
</td></tr></table>
</td></tr></table>

</form>
<% end if %>

<% else %>

<table border = "0" cellpadding=0 cellspacing=0 width = "890" align = "center">

		<tr><td class = "Menu2" colspan  "3" height = "1">
		
		 <% sql = "select * from AdvertisingLevels  where EventID = " & EventID 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any Advertising options listed. To add Advertising options please select  <a href = "AdvertisingsAddOptions.asp?EventID=<%=EventID%>" class = "menu2">Add Advertising Options</a>. 
		
	<% else %>	
		
		Below are a list of the Advertising options that your have for your event:
		
		
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
	<table border = "0" cellpadding=0 cellspacing=0 width = "890" align = "center">
	  <tr bgcolor = "#DBF5F3">
		     <td class="Menu2" align = "center" width = "600">
	       <b>Title</b>
	     </td>
	     <td class="Menu2" align = "center" >
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
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="AdvertisingLevelID" value= "<%= AdvertisingLevelID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="Menu2" width = "250">
	       <a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>" class="Menu2"><%=AdvertisingLevelName%></a>
	     </td>
	     <td class="Menu2" align = "right">
	       <a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>" class="Menu2" ><% IF LEN(AdvertisingLevelPrice) > 1 then %>
	       																												<%=formatcurrency(AdvertisingLevelPrice,2)%>
	       																											<% else %>
	       																												FREE
	       																											<% end if %></a><img src = "images/px.gif" width = "20" height = "10" alt = "price" border = "0">
	     </td>
     	<td class="Menu2" align = "center">
	      <a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Advertising Option"></a>  
	      <a href = "AdvertisingLevelDeleteHandleForm.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Advertising Option"></a>

	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<% end if %>
<br>
<table width = "450" align = "center">
   <tr><td class="Menu2" >To add advertising options please select  <a href = "AdvertisingsAddOptions.asp?EventID=<%=EventID%>" class = "menu2">Add Advertising Options</a>
   </td>
   </tr>
   </table>

<% end if %>

<!--#Include file="970Bottom.asp"-->
<br><br><br>
<div align = "center"><a href = "#Top" class ="body">Click here to go to the top of the page.</a></center>

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
