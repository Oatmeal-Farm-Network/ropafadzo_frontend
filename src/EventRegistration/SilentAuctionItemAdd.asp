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
	   <td  valign = "top"   colspan = "3"><br><h2>Add a Silent Auction Item</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
</table>


<!--#Include virtual="PeopleDataInclude.asp"--> 




<form  name="form" action="SilentAuctionAddItemHandleForm.asp?eventID=<%=eventid%>" method = "post">

<input name="Action" Value ="Add"  type = "hidden">

<input name="EventID" Value ="<%=EventID%>"  type = "hidden">
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >

	<tr>
		<td class = "body2" colspan = "2" >
				<b>Please enter information on the donator and donation(s) below, <br>
				then select the "Add Auction Donations" button at the bottom of this page:</b><br> (* Indicates Required Fields)
<% if len(Message) > 1 then %><br>
<font color = "red"><b><%=Message%></b></font>
<% end if %>
		</td>
	</tr>
<tr>
	<td  class = "body2"  colspan = "2" ><br>
		<b>Donated By:</b>
	</td>
</tr>
</table>
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >
	<tr>
	<td width = "50%">
	   <table>
	      <tr>
			<td class = "body2" align = "right" WIDTH = "150">
					First Name*: &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
						
			
			<tr>
				<td   class = "body2" align = "right">
					Email: &nbsp;
				</td>
				<td  align = "left" valign = "top" class = "body2">
					<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
				</td>
</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeoplePhone"  size = "30" value = "<%=PeoplePhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleCell"  size = "30" value = "<%=PeopleCell%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleFax"  size = "30" value = "<%=PeopleFax%>">
							</td>
						</tr>

</table>
</td>
<td width = "50%">
<table>
<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressStreet"  size = "30" value = "<%=AddressStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<input name="AddressApt"  size = "30" value = "<%=AddressApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<input name="AddressCity"  size = "30" value = "<%=AddressCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="AddressState">
							<% If Len(AddressState) > 0 then%>
								<option value="<%=AddressState%>" selected><%=AddressState%></option>
							<% Else %>
								<option value="" selected>-----</option>
							<% End If %>
					<option value="AL">AL</option>
					<option  value="AK">AK</option>
					<option  value="AZ">AZ</option>
					<option  value="AR">AR</option>
					<option  value="CA">CA</option>
					<option  value="CO">CO</option>
					<option  value="CT">CT</option>
					<option  value="DE">DE</option>
					<option  value="DC">DC</option>
					<option  value="FL">FL</option>
					<option  value="GA">GA</option>
					<option  value="HI">HI</option>
					<option  value="ID">ID</option>
					<option  value="IL">IL</option>
					<option  value="IN">IN</option>
					<option  value="IA">IA</option>
					<option  value="KS">KS</option>
					<option  value="KY">KY</option>
					<option  value="LA">LA</option>
					<option  value="ME">ME</option>
					<option  value="MD">MD</option>
					<option  value="MA">MA</option>
					<option  value="MI">MI</option>
					<option  value="MN">MN</option>
					<option  value="MS">MS</option>
					<option  value="MO">MO</option>
					<option  value="MT">MT</option>
					<option  value="NE">NE</option>
					<option  value="NV">NV</option>
					<option  value="NH">NH</option>
					<option  value="NJ">NJ</option>
					<option  value="NM">NM</option>
					<option  value="NY">NY</option>
					<option  value="NC">NC</option>
					<option  value="ND">ND</option>
					<option  value="OH">OH</option>
					<option  value="OK">OK</option>
					<option  value="OR">OR</option>
					<option  value="PA">PA</option>
					<option  value="RI">RI</option>
					<option  value="SC">SC</option>
					<option  value="SD">SD</option>
					<option  value="TN">TN</option>
					<option  value="TX">TX</option>
					<option  value="UT">UT</option>
					<option  value="VT">VT</option>
					<option  value="VA">VA</option>
					<option  value="WA">WA</option>
					<option  value="WV">WV</option>
					<option  value="WI">WI</option>
					<option  value="WY">WY</option>
					<option  value=""></option>
					<option  value="ON">ON</option>
					<option  value="QC">QC</option>
					<option  value="BC">BC</option>
					<option  value="AB">AB</option>
					<option  value="MB">MB</option>
					<option  value="SK">SK</option>
					<option  value="NS">NS</option>
					<option  value="NB">NB</option>
					<option  value="NL">NL</option>
					<option  value="PE">PE</option>
					<option  value="NT">NT</option>
					<option  value="YK">YK</option>
					<option  value="NU">NU</option>

				</select>


							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressZip"  size = "8" value = "<%=AddressZip%>">
							</td>
						</tr>
</table>
</td>
	</tr>
</table>
<table width = "900"  align = "center"  border="0"  cellspacing="0" cellpadding="0" >
   <tr>
	<td  class = "body2"  colspan = "2" >
		<b>Donations:</b>
	</td>
</tr>
<tr>
<td>
<% rowcount = 1
row = "odd"

for rowcount = 1 to 6 
 If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
		<table width = "450"  align = "center" bgcolor = "antiquewhite" border="0"  cellspacing="0" cellpadding="0" >

<% Else %>
	<table width = "450"  align = "center" bgcolor = "#DBF5F3" border="0"  cellspacing="0" cellpadding="0" >
<% End If %>


<tr>
   <td  class = "body2">
   <table border="0"  cellspacing="0" cellpadding="0">
     <Tr><td class= "body2">
   <br>
   Item Name: <input name="SAuctionTitle(<%=rowcount%>)"  size = "60" >
   </td>
  </tr>
  <tr>
   <td  valign = "top" class= "body2">
	<div valign = "top">Value: $<input name="SAuctionValue(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8"></div>
	</td></tr>
	<tr><td class ="body2" ><div valign = "top">Min. Bid: $<input name="SAuctionMinBid(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8"></div>
	</td>
	</tr>
	<tr>
	<td class = "body2">
	
	<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  

 

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1<%=rowcount%>");
		</script> 

		Description <small>(1600 Charecters Maximum)</small>:<br>
			<textarea name="SAuctionDescription(<%=rowcount%>)"  cols="97" rows="4"   class = "body" id="textarea1<%=rowcount%>"></textarea>
		
	</td>
</tr>
</table>
<% rowcount= rowcount + 1%>

 <td  class = "body2">
   <table border="0"  cellspacing="0" cellpadding="0">
     <Tr><td class= "body2">
   <br>
   Item Name: <input name="SAuctionTitle(<%=rowcount%>)"  size = "60" >
   </td>
  </tr>
  <tr>
   <td  valign = "top" class= "body2">
	<div valign = "top">Value: $<input name="SAuctionValue(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8"></div>
	</td></tr>
	<tr><td class ="body2" ><div valign = "top">Min. Bid: $<input name="SAuctionMinBid(<%=rowcount%>)"  class="positive" size = "4" maxlength = "8"></div>
	</td>
	</tr>
	<tr>
	<td class = "body2">
	
	<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  

 

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1<%=rowcount%>");
		</script> 

		Description <small>(1600 Charecters Maximum)</small>:<br>
			<textarea name="SAuctionDescription(<%=rowcount%>)"  cols="97" rows="4"   class = "body" id="textarea1<%=rowcount%>"></textarea>
		
	</td>
</tr>
</table>

	</td>
</tr>
</table>

<% Next %>
	

<table width = "900"  align = "center" bgcolor = "#DBF5F3" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr><td  align = "center">
<input name="TotalCount" type = "hidden"  value = "<%=Rowcount%>">
	
	<input type=submit value = "Add Auction Donations" class = "regsubmit2">


</td></tr>
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
</table>
</td>
	</tr>
</table>

	

	</form>

<br><br>


<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>