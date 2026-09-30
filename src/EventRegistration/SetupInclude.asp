<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.PeopleFirstName.value=="") {
themessage = themessage + " - Registrant First Name \r";
}
if (document.form.PeopleEmail.value=="") {
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


<form  name=form method="post" action="SetupAccountStep2.asp">
<table border = "0" width = "900" align = "center"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=5>
	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<H1>Setup Your Account</H1>
		</td>
	</tr>
	
	<tr>
		<td class = "body2" colspan = "2" align = "center">
				Please enter your information below: (* Indicates Required Fields)

		</td>
	</tr>
	<tr>
		<td valign = "top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "450">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr>
				<td class = "body2" align = "right">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" >
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
				<td  class = "body2" align = "right">
					Title: &nbsp;
				</td>
				<td class = "body2" width = "350"  >
					<select size="1" name="PeopleTitleID">
						<option value= "4">N/A</option>

<% 
  sql = "select * from PeopleTitleLookup where not PeopleTitle = 'N/A'"
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
		<option value= "<%=rs("PeopleTitleID") %>"><%=rs("PeopleTitle") %></option>
  <% 
  rs.movenext
  wend 
end if %>
 </select>
    	</td>
	</tr>
<tr>
	<td class = "body2" align = "right">
			Your Website: &nbsp;
		</td>
		<td class = "body2">
			http://<input name="PeopleWebsite" Value ="<%=PeopleWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
							<tr>
							<td   class = "body2" align = "right">
								Email:* &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
							</td>
						</tr>

	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

</table><img src = "images/px.gif" width = "450" height = "5"><table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "450">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
	<tr>
	<td class = "body2" align = "right">Password: &nbsp;</td>
	<td><label><input name="password" type="password" value="<%=password%>"></label></td>
	</tr>
	<tr>
	<td class = "body2" align = "right">Confirm Password: &nbsp;</td>
	<td><label><input name="confirm" type="password" value="<%=password%>"></label></td>
	</tr>
	<tr>
	<td class = "body2" colspan = "2" align = "center">
		Password should be 5-12 characters long.
	</td>
	</tr>

	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

</table>

</td>
<td width = "50%" valign = "Top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "450">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr>
						  <td   class = "body2" align = "right">
								Street Address: &nbsp;
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
							<% If Len(Peoplestate) > 0 then%>
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
						<tr>
		<td class ="body2" valign = "top" colspan = "2" height = "53">
			<br>
		</td>
	</tr>
</table>
</td>
</tr>
</table>
<table width = "900"  align = "center" bgcolor = "#DBF5F3" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr><td  align = "center">
	<input name="PeopleID"  type = "Text" value = "<%=PeopleID%>">
	<% if len(PeopleID)>0 then %>
		<input type=button value="Update Your Account"  class = "Peoplesubmit2" onclick="verify();">
	<% else %>
	<input type=button value="Create Your Account"  class = "Peoplesubmit2" onclick="verify();">
    <% end if %>
</td></tr>
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>


</table>

	</form>
<br><br><br>
