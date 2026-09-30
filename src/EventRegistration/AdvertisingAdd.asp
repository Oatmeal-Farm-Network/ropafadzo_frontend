<%@ Language="VBScript" %> 

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<!--#Include virtual="GlobalVariables.asp"-->
<title>Add Advertisor</title>

<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
<% message=request.querystring("message")%>

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

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include virtual="AdvertisingHeader.asp"-->
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
 <% PageTitleText =  "Add an Advertiser" %>
<!--#Include file="970Top.asp"-->
<table border = "0"  cellpadding=0 cellspacing=0 width = "960" align = "center" >
	<tr>
		<td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
  	<tr>
  		<td class = "body2"  >
	  		<% if len(message) > 1 then %>
				&nbsp;&nbsp;<font color = "red">Your advertiser has been added. To edit advertisers please select  <a href = "AdvertisingEdit.asp?EventID=<%=EventID%>#Options" class = "menu2">Edit Advertisers</a></font><br>
			<% end if %>
		</td>
	</tr>
</table>

<% sql = "select * from AdvertisingLevels  where EventID = " & EventID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    if  rs.eof then %>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "960" align = "center">
	<tr>
		<td Class = "menu2" >
		Before you can add advertisers you need to add advertiser options. Currently you do not have any advertiser options. To add advertiser options please select <a href = "AdvertisingsAddOptions.asp?EventID=<%=eventID%>" class = "menu2">Add Advertising Options</a>.
.
		</td>
	</tr>
</table>

<% else %>
<%Currentpagename = "AdvertisingAdd.asp"%>

<!--#Include virtual="PeopleDataInclude.asp"--> 

<form  name="form" action="AdvertisingAddHandle.asp?EventID=<%=EventID%>" method = "post">

<input name="_requiredFields" type="hidden" value="Business_Name">
<input name="EventID" Value ="<%=EventID%>"  type = "hidden">
<table border = "0" cellpadding=0 cellspacing=0  width = "940" align = "center">
<tr>
<td valign = "top">

<table width = "360" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr>
	<td class = "body2" align = "right" ><small>Booth Type:&nbsp;</small></td>

	<%
		Set rs2 = Server.CreateObject("ADODB.Recordset")	
		sql = "select * from AdvertisingLevels where EventID = " & EventID
	    rs2.Open sql, conn, 3, 3  
	 
	    
	%> 
  	<td  class = "body2">
			 <select size="1" name="AdvertisingLevelID">

			<% While Not rs2.eof  %>
				<option  value="<%=rs2("AdvertisingLevelID")%>"><%=rs2("AdvertisingLevelName")%> @ $<%=rs2("AdvertisingLevelPrice")%></option>
 			<%  rs2.movenext
  				Wend 
  			%>	
			</select>
	</td>
</tr>
<tr>
	<td class = "body2" align = "right" width = "250"><small>Amount Paid:&nbsp;</small>
	</td>
	<td class = "body2">
		$<input name="AdvertisingPaidAmount" Value ="<%=AdvertisingPaidAmount%>" class="positive"  size = "25" maxlength = "8">
		<script type="text/javascript">
		$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
		</script>

	 </td>
</tr>	 
<tr>
 	<td class = "body2" align = "right"><small>Payment Date:&nbsp;</small> </td>
 	<td class = "body2">

		<select size="1" name="AdvertisingPaidAmountMonth">

			<% if len(AdvertisingPaidAmountMonth) > 0 then %>
					<option value="<%=AdvertisingPaidAmountMonth%>" selected><%=AdvertisingPaidAmountMonth%>;</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
		</select>
		<select size="1" name="AdvertisingPaidAmountDay">
			<% if len(AdvertisingPaidAmountDay) > 0 then %>
					<option value="<%=AdvertisingPaidAmountDay%>" selected><%=AdvertisingPaidAmountDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
		</select>
		<select size="1" name="AdvertisingPaidAmountYear">
				<% if len(AdvertisingPaidAmountYear) > 0 then %>
					<option value="<%=AdvertisingPaidAmountYear%>" selected><%=AdvertisingPaidAmountYear%></option>
					
					<% if not AdvertisingPaidAmountYear = year(now) then%>
					  <option value="<%=year(now)%>" ><%=year(now)%></option>
					<% end if %>
					
					
				<% else %>
				   <option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear + 1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %>
		</select>
	</td>
</tr>

<tr>
	<td class = "body2" align = "right" width = "200"><small>Business Name:&nbsp;</small></td>
	<td class = "body2"><input name="BusinessName" Value ="<%=BusinessName%>"  size = "26" maxlength = "61"></td>
</tr>	 
<tr>
	<td class = "body2" align = "right" width = "180"><small>Organization's Type:&nbsp;</small></td>
	<td class = "body2">			
		<select size="1" name="BusinessTypeID">
			<option value= "2">N/A</option>
			<% 
				sql = "select * from BusinessTypeLookup where not BusinessTypeID = 2 "
				
  				Set rs = Server.CreateObject("ADODB.Recordset")
  				rs.Open sql, conn, 3, 3   
 				 if not rs.eof then
  					while not rs.eof %>
						<option value= "<%=rs("BusinessTypeID") %>"><%=rs("BusinessType") %></option>
			<%rs.movenext
  				wend 
			end if %>
 		</select>
	</td>
</tr>
<tr>
	<td class = "body2" align = "right" size="25"><small>Contact First Name:&nbsp;</small></td>
	<td class = "body2">
		<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "26" maxlength = "61">
	</td>
</tr>
<tr>
	<td class = "body2" align = "right" size="25"><small>Contact Last Name:&nbsp;</small></td>
	<td class = "body2">
		<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "26" maxlength = "61">
	</td>
</tr>
<tr>
 	<td class = "body2" align = "right" size="25"><small>Hours of Operation:&nbsp;</small></td>
	<td class = "body2">
		<input name="BusinessHours" Value ="<%=BusinessHours%>"  size = "26" maxlength = "61">
	</td>
</tr> 
</table>
</td>

<td valign = "top">	
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
	<td class = "body2" colspan = "2"><small>Quantity:</small>
	<select size="1" name="AdvertisingQTY">
	<% for x = 1 to 20 %>
	<option value= "<%=x%>"><%=x%></option>
 	<% next %>
 </select>

	</td>
</tr>

<tr>
	<td class = "body2" align = "right"><small>Email:*&nbsp;</small></td>
	<td class = "body2">
		<input name="BusinessEmail" Value ="<%=BusinessEmail%>"  size = "27" maxlength = "61">
	</td>
</tr>	 
<tr>	 
  <td class = "body2" align = "right"><small>Website:</small></td>
  <td class = "body2"><small>http://</small>
		<input name="BusinessWebsite" Value ="<%=BusinessWebsite%>"  size = "20" maxlength = "61">
	</td>
</tr>
<tr>					
	<td   class = "body2" align = "right">
								<small>Phone: </small>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessPhoneID" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
								<input name="BusinessPhone"  size = "27" value = "<%=BusinessPhone%>">
							</td>
</tr>

<tr>
	<td   class = "body2" align = "right">
		<small>Cell:</small>
	</td>
	<td  align = "left" valign = "top" class = "body2">
		<input name="BusinessCell"  size = "27" value = "<%=BusinessCell%>">
	</td>	
</tr>
<tr>
	<td   class = "body2" align = "right"><small>Fax: </small></td>
	<td  align = "left" valign = "top" class = "body2"><input name="BusinessFax"  size = "27" value = "<%=BusinessFax%>"></td>
</tr>

</table>
</td>
<td valign = "top">	 
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
	<td   class = "body2" align = "right"><small>Street: </small></td>
	<td  align = "left" valign = "top" class = "body2">
		<input name="BusinessAddress"  size = "26" value = "<%=BusinessAddress%>">
	</td>
</tr>
<tr>
	<td   class = "body2"  align = "right"><small>Apartment / Suite: </small></td>
	<td  valign = "top" class = "body2">
		<input name="BusinessApt"  size = "26" value = "<%=BusinessApt%>">
	</td>
</tr>
<tr>
	<td   class = "body2" align = "right"><small>City: </small></td>
	<td  valign = "top" class = "body2">
		<input name="BusinessCity"  size = "26" value = "<%=BusinessCity%>">
	</td>
</tr>
<tr>
	<td  align = "right" class = "body2"><small>State/ Provence: </small></td>
	<td  align = "left" valign = "top" class = "body2">				
		<select size="1" name="BusinessState">
			<% If Len(BusinessState) > 0 then%>
				<option value="<%=BusinessState%>" selected><%=BusinessState%></option>
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
	<td  align = "right" class = "body2"><small>Country: </small></td>
	<td  align = "left" valign = "top" class = "body2">			
		<select size="1" name="BusinessCountry">
			<option value="USA" selected>USA</option>
			<option value="Canada">Canada</option>		
		</select>
	</td>
</tr>
<tr>
	<td   class = "body2" align = "right"><small>Postal Code: </small></td>
	<td  align = "left" valign = "top" class = "body2">
		<input name="BusinessZip"  size = "8" value = "<%=BusinessZip%>">
	</td>
</tr>

</table>
</td>
</tr>
<tr>
	<td   class = "body2" align = "center" colspan = "3">
	<input type=submit value = "Add Advertiser" class="regsubmit2">
	
	</td>
</tr>
</table>
</form> 

<% end if %>

<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>

</HTML>