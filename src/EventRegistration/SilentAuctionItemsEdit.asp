<%@ Language="VBScript" %> 


<html>
<head>


<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">


<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.BusinessEmail.value=="") {
themessage = themessage + " - EMail Addrerss \r";
}
//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>



<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>



</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="SilentAuctionHeader.asp"-->


<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Edit Silent Auction Donations</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
row = "odd"
rowcount = 1
row = "even"
rowcount = 1
 
sql = "select  * from SilentAuctionItems, People where SilentAuctionItems.PeopleID = People.PeopleID and SilentAuctionItems.EventID= " & EventID & " order by SAuctionID"

'response.write("sql= " & sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then	%>


<form  name="form" action="SilentAuctionAddItemHandleForm.asp" method = "post">
<input name="Action" Value ="Update"  type = "hidden">
<input type = "hidden" name="EventID" value= "<%= EventID %>" >
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
while Not rs.eof 

SAuctionID =rs("SAuctionID")

 If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
		<table width = "750"  align = "center" bgcolor = "antiquewhite" border="0"  cellspacing="0" cellpadding="0" >

<% Else %>
	<table width = "750"  align = "center" bgcolor = "#DBF5F3" border="0"  cellspacing="0" cellpadding="0" >
<% End If %>


<tr>
   <td colspan = "2" class = "body2">
   <br>
   <img src = "images/px.gif" width = "33" height = "1">Item Name: <input name="SAuctionTitle(<%=rowcount%>)" value= "<%=rs("SAuctionTitle")%>" size = "78" >
   <input name="AddressID(<%=rowcount%>)" value= "<%=rs("AddressID")%>" type = "hidden" >
   <input name="SAuctionID(<%=rowcount%>)" value= "<%=rs("SAuctionID")%>" type = "hidden" >


   </td>
  </tr>
  <tr>
   <td width = "250" valign = "top">
      <table>
     	 <tr><td class ="body2" align = "right" width = "100">Item Number: </td><td class ="body2" ><%=SAuctionID%>

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
     	 
     	 
     	 </td></tr>
		 <tr><td class ="body2" align = "right" >Value: </td><td class ="body2" align = "left" >$<input name="SAuctionValue(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8" value= "<%=rs("SAuctionValue")%>">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>


		 
		 </td></tr>
		 <tr><td class ="body2" align = "right" >Min. Bid: </td><td class ="body2" align = "center" >$<input name="SAuctionMinBid(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8" value= "<%=rs("SAuctionMinBid")%>">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>

		 
		 </td></tr>
		 <tr><td colspan = "2" class = "body2">
		 Donated By:<br>
		 <img src = "images/px.gif" width = "5" height = "1"><%=rs("PeopleFirstName")%>&nbsp;<%=rs("PeopleLastName")%>
		 
		 
		 </td>
		 </tr>
		 <tr>

  		<td class = "body2"bgcolor = "brown" colspan = "2">
		<input TYPE="checkbox" name="Delete(<%=rowcount%>)"  ><font color = "white">Delete This Auction Item &nbsp;</font>
		</td>
	</tr>

	  </table>
	</td>
	<td width = "650" class = "body2">
	
			<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1<%=SAuctionID%>");
		</script>
		
		
		Description <small>(1600 Charecters Maximum)</small>:<br>
			<textarea name="SAuctionDescription(<%=rowcount%>)"  cols="97" rows="4"   class = "body" id="textarea1<%=SAuctionID%>"><%=rs("SAuctionMinBid")%></textarea>
	</td>
</tr>
</table>
<%	
rowcount = rowcount + 1
rs.movenext
   wend

 
 %>

</table>
<table>
<tr><td  align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "Update" >
</td></tr></table>
</form>
<% else %>

<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top"  class = "body"><br>Currently you do not have any silent auction donations. To add donations please select  <a href = "SilentAuctionItemAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Donations</a>.
</td>
</tr>
</table>

 
<%  end if %>
	
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>