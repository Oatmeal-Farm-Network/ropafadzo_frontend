<!DOCTYPE html>
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>



<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.RegFirstName.value=="") {
themessage = themessage + " - Registrant First Name \r";
}
if (document.form.BusinessEmail.value=="") {
themessage = themessage + " - Registrant E-mail \r";
}
 if(document.form.password.value != document.form.confirm.value) {
	themessage = themessage + " -Please check your password; the confirmation entry does not match \r";

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

<% 
If Len(session("RegcustID"))> 0 then
	sql2 = "select * from Event where PeopleID= " & session("EventType") 
	response.write("B sql2 = " & sql2 & "<br>")

	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof  Then
		password = rs2("password")	
		RegEmail = rs2("BusinessEmail")
		RegFirstName = rs2("RegFirstName")
		RegLastName = rs2("RegLastName")
		RegStreet = rs2("RegStreet")
		RegApt= rs2("RegApt")
		RegCity = rs2("RegCity")
		RegState = rs2("RegState")
		RegZip = rs2("RegZip")
		RegPhone = rs2("RegPhone")
		
		RegEventLocationName = rs2("RegEventLocationName")
		RegEventLocationWebsite = rs2("RegEventLocationWebsite")
		RegEventLocationHours = rs2("RegEventLocationHours")
		RegEventLocationHourEmail = rs2("RegEventLocationEmail")
		RegEventLocationStreet = rs2("RegEventLocationStreet")
		RegEventLocationApt= rs2("RegEventLocationApt")
		RegEventLocationCity = rs2("RegEventLocationCity")
		RegEventLocationState = rs2("RegEventLocationState")
		RegEventLocationZip = rs2("RegEventLocationZip")
		RegEventLocationPhone = rs2("RegEventLocationPhone")
		RegEventLocationCell = rs2("RegEventLocationCell")
		RegEventLocationFax = rs2("RegEventLocationFax")
	End if	
		End if	
response.write("password  =" & Password & "<br>" )
%>

</head>

<body border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<br>
<form  name=form method="post" action="RegCreateStep2.asp">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5    width = "800" align = "center">

	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<H1>List Your Event</H1>
			<h2>Step 1:Basic Facts</h2>
			To list your event, please enter the following information.
			<br>* Required field
		</td>
	</tr>
	<tr>
	   <td width = "450" valign = "top">
	
	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 bgcolor = "#DBF5F3" width = "450" align = "center">
	<tr>
		<td CLASS = "body2" colspan = "2">
			<h3>A Little About Your Event</h3>
		</td>
	</tr>
	<tr>
				<td  class = "body2" align = "right">
					Event Type:
				</td>
				<td class = "body2" width = "350"  >
					<select size="1" name="EventTypeID">
					
<% 
sql = "select * from EventTypesLookup"
response.write("sql ="  & sql & ",br>" )
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
  
		<option value= "<%=rs("EventTypeID") %>"><%=rs("EventType") %></option>
<% 
  rs.movenext
  wend 
end if %>
 </select>
    	</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			Event Name*
		</td>
		<td class = "body2">
			<input name="EventName" Value ="<%=EventName%>"  size = "23" maxlength = "61">
		</td>
</tr>
	<tr>
		<td class = "body2" align = "right">
			Start Date: &nbsp;</td>
		<td>
				<select size="1" name="EventStartMonth">
					<option value="" selected>------</option>
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
				<select size="1" name="EventStartDay">
					<option value="" selected>------</option>
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
		<select size="1" name="EventStartYear">
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
					
				
			<% currentyear = year(date) 
						response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td>
				<select size="1" name="EventEndMonth">
					<option value="" selected>------</option>
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
				<select size="1" name="EventEndDay">
					<option value="" selected>------</option>
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
		<select size="1" name="EventEndYear">
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
					
				
			<% currentyear = year(date) 
						response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
     </table>
     
     
     <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 bgcolor = "#DBF5F3" width = "450" align = "center">
				<tr>
				  <td bgcolor = "#82D8D0" colspan = "2">
				     <h3>Primary Contact</h3>
 
				  </td>
				 </tr>
						<tr>
							<td class = "body2" align = "right">
								First Name
							</td>
							<td class = "body2" align = "left" >
								<input name="RegFirstName" Value ="<%=RegFirstName%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Last Name*
							</td>
							<td class = "body2">
									<input name="RegLastName" Value ="<%=RegLastName%>"  size = "23" maxlength = "61">
							</td>
						</tr>
					<tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 bgcolor = "#DBF5F3" width = "450" align = "center">
				<tr>
				  <td bgcolor = "#82D8D0" colspan = "2">
				     <h3>Event Location</h3>
 
				  </td>
				 </tr>
						<tr>
							<td class = "body2" align = "right">
								Name of Location: &nbsp;
							</td>
							<td class = "body2" align = "left" >
								<input name="RegEventLocationName" Value ="<%=RegEventLocationName%>"  size = "23" maxlength = "61">
						</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Website: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationWebsite" Value ="<%=RegEventLocationWebsite%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Hours Of Operation: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationHours" Value ="<%=RegEventLocationHours%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Contact Email: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationEmail" Value ="<%=RegEventLocationEmail%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Street: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationStreet" Value ="<%=RegEventLocationStreet%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Apartment / Suite: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationApt" Value ="<%=RegEventLocationApt%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td class = "body2">
									<input name="RegEventLocationCity" Value ="<%=RegEventLocationCity%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="StreetState">
							<% If Len(Regstate) > 0 then%>
								<option value="<%=RegEventLocationState%>" selected><%=RegEventLocationState%></option>
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
						<td class = "body2" align = "right">
								Phone: &nbsp;
							</td>
						<td class = "body2">
									<input name="RegEventLocationPhone" Value ="<%=RegEventLocationPhone%>"  size = "23" maxlength = "61">
							</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
								Cell: &nbsp;
							</td>
						<td class = "body2">
									<input name="RegEventLocationCell" Value ="<%=RegEventLocationCell%>"  size = "23" maxlength = "61">
							</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
								Fax: &nbsp;
							</td>
						<td class = "body2">
								<input name="RegEventLocationFax" Value ="<%=RegEventLocationFax%>"  size = "23" maxlength = "61">
							</td>
					</tr>
				<tr>
</table>


       </td>	
	   <td width = "450" valign = "top">
		
	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 bgcolor = "#DBF5F3" width = "450" align = "center">
	<tr>			
				  <td bgcolor = "#82D8D0" colspan = "2">
				     <h3>Who is Putting on the Show?</h3>
				     Please enter below information about the Association or business that is hosting the event, if applicable.
				  </td>
				 </tr>
					<tr>
						<td class = "body2" align = "right">
							Organization's Name: &nbsp;
						</td>
						<td class = "body2">
							<input name="BusName" Value ="<%=BusinessName%>"  size = "23" maxlength = "61">
						</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							Organization's Type: &nbsp;
						</td>
						<td class = "body2">
									<input name="BusinessType" Value ="<%=BusinessType%>"  size = "23" maxlength = "61">
							</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							Website: &nbsp;
						</td>
						<td class = "body2">
									<input name="BusinessWebsite" Value ="<%=BusinessWebsite%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
						<td class = "body2" align = "right">
							Hours of Operation: &nbsp;
						</td>
						<td class = "body2">
									<input name="BusinessHours" Value ="<%=BusinessHours%>"  size = "23" maxlength = "61">
							</td>
						</tr>
					<tr>
							<td class = "body2" align = "right">
								Contact Email:* &nbsp;
							</td>
						<td class = "body2">
									<input name="BusinessEmail" Value ="<%=BusinessEmail%>"  size = "23" maxlength = "61">
						</td>

					<tr>
						  <td   class = "body2" align = "right">
								Street: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="StreetAddress"  size = "30" value = "<%=StreetAddress%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<input name="StreetApt"  size = "30" value = "<%=StreetApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<input name="StreetCity"  size = "30" value = "<%=StreetCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="StreetState">
							<% If Len(Regstate) > 0 then%>
								<option value="<%=StreetState%>" selected><%=StreetState%></option>
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
								<input name="StreetZip"  size = "8" value = "<%=StreetZip%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="Phone"  size = "30" value = "<%=Phone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="Cell"  size = "30" value = "<%=Cell%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="Fax"  size = "30" value = "<%=Fax%>">
					</td>
				</tr>
		</table>
	</td>
</tr>
</table>

		
<table width = "800" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" value="Submit"   >
<tr>
	<td  align = "center">
	<input type=button value="Submit"  class = "regsubmit2" onclick="verify();">
	</td>
</tr>
</table>
		
					
 </form> 
<br><br><br>
	

<!--#Include virtual="Footer.asp"--> 
</body>
</HTML>