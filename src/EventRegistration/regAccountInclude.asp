<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.RegFirstName.value=="") {
themessage = themessage + " - Registrant First Name \r";
}
if (document.form.RegEmail.value=="") {
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
	'response.write("RegcustID=")
	'response.write(session("RegcustID"))
	If Len(session("RegcustID"))> 0 then
	sql2 = "select * from Registrants where RegcuistID= " & session("RegcustID") 
'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	

	if Not rs2.eof  Then
		sEvent = rs2("Event")
		RegEventMonth = rs2("RegEventMonth")
		RegEventDay = rs2("RegEventDay")
		RegEventYear = rs2("RegEventYear")
		RegFirstName = rs2("RegFirstName")
		RegLastName = rs2("RegLastName")
		RegStreet = rs2("RegStreet")
		RegCity = rs2("RegCity")
		RegState = rs2("RegState")
		RegZip = rs2("RegZip")
		RegPhone = rs2("RegPhone")
		RegEmail = rs2("RegEmail")
		CoRegFirstName = rs2("CoRegFirstName")
		CoRegLastName = rs2("CoRegLastName")
		CoRegUseRegAddress = rs2("CoRegUseRegAddress")
		CoRegStreet = rs2("CoRegStreet")
		CoRegCity = rs2("CoRegCity")
		CoRegState = rs2("CoRegState")
		CoRegZip = rs2("CoRegZip")
		CoRegPhone = rs2("CoRegPhone")
		CoRegEmail = rs2("CoRegEmail")

		password = rs2("password")
		regEmail = rs2("regemail")





	End if	
		End if	
%>





<table border = "0" width = "650" align = "center"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class ="body" valign = "top" >
			<H1>Your Registry Account</H1>
		</td>
	</tr>
	<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
	
	<tr>
		<td class = "body" >
			<a name="Add"></a>
			
			To update your account information make your changes below then select the Save Changes button at the bottom of this page.
			<br>* Required field

		</td>
	</tr>

<form  name=form method="post" action="RegAccountInfoStep2.asp">

	<tr>
		<td height = "1" bgcolor = "#abacab"><Img src = "images/px.gif" height = "0" width = "0"></td>
	</tr>
	<tr>
		<td CLASS = "BODY">
			EVENT INFORMATION<br>
		</td>
	</tr>
	<tr>
		<td>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
			<tr>
				<td  class = "body">	
					Event:
				</td>
			</tr>
			<tr>
				<td class = "body" width = "250"  >
					<select size="1" name="sEvent">
					<option value="<%=sEvent%>" selected><%=sEvent%></option>
					<option value="Wedding">Wedding</option>
					<option  value="Baby">Baby</option>
					<option  value="Anniversary">Anniversary</option>
					<option  value="Other">Other</option>
					</select>
				</td>
			</tr>
		</table>
			
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	<tr>
		<td class = "body" >
			Event Date:
		</td>
	</tr>
	<tr>
		<td>
				<select size="1" name="RegEventMonth">
					<option value="<%=RegEventMonth%>" selected><%=RegEventMonth%></option>
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
				<select size="1" name="RegEventDay">
					<option value="<%=RegEventDay%>" selected><%=RegEventDay%></option>
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
		<select size="1" name="RegEventYear">
					<option value="<%=RegEventYear%>" selected><%=RegEventYear%></option>
					
				
			<% currentyear = year(date) 
						response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
	  </table><br>
	 </td>
	</tr>
	<tr>
		<td height = "1" bgcolor = "#abacab"><Img src = "images/px.gif" height = "0" width = "0"></td>
	</tr>
	<tr>
		<td CLASS = "BODY">
			REGISTRANT INFORMATION<br>
		</TD>
	</tr>
	<tr>
		<td>
		<table width = "500" width = "center" border = "0">
				<tr>
					<td class = "body" >
					REGISTRANT<br>
					<table width = "250">
						<tr>
							<td class = "body">
								First Name*
							</td>
						</tr>
							<tr>
							<td class = "body">
									<input name="RegFirstName" Value ="<%=RegFirstName%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<td class = "body">
								Last Name*
							</td>
						</tr>
							<tr>
							<td class = "body">
									<input name="RegLastName" Value ="<%=RegLastName%>"  size = "23" maxlength = "61">
							</td>
						</tr>

						<tr>
							<td   class = "body">
								Mailing address:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="RegStreet"  size = "30" value = "<%=RegStreet%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								City:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="RegCity"  size = "30" value = "<%=RegCity%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								State/ Provence
							</td>
						</tr>
						<tr>
							<td  align = "left" valign = "top" class = "body">
					
							<select size="1" name="RegState">
							<% If Len(Regstate) > 0 then%>
								<option value="<%=RegState%>" selected><%=RegState%></option>
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
							<td   class = "body">
								Postal Code:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="RegZip"  size = "8" value = "<%=RegZip%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								Phone:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="RegPhone"  size = "30" value = "<%=RegPhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								Email:*
							</td>
						</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="RegEmail"  size = "30" value = "<%=RegEmail%>">
							</td>
						</tr>
					</table>


					</td>
					<td class = "body" width = "300">
					CO-REGISTRANT<br>
					<table>
						<tr>
							<td class = "body">
								First Name
							</td>
						</tr>
							<tr>
							<td class = "body">
									<input name="CoRegFirstName" Value ="<%=CoRegFirstName%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<td class = "body">
								Last Name
							</td>
						</tr>
							<tr>
							<td class = "body">
									<input name="CoRegLastName" Value ="<%=CoRegLastName%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						
						
						<tr>
							<td   class = "body">
								Mailing address:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="CoRegStreet"  size = "30" value = "<%=CoRegStreet%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								City:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="CoRegCity"  size = "30" value = "<%=CoRegCity%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								State/ Provence
							</td>
						</tr>
						<tr>
							<td  align = "left" valign = "top" class = "body">
					
							<select size="1" name="CoRegState">
							<option value="<%=CoRegState%>" selected><%=CoRegState%></option>
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
							<td   class = "body">
								Postal Code:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="CoRegZip"  size = "8" value = "<%=CoRegZip%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								Phone:
							</td>
							</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="CoRegPhone"  size = "30" value = "<%=CoRegPhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body">
								Email:
							</td>
						</tr>
							<tr>
							<td  align = "left" valign = "top" class = "body">
								<input name="CoRegEmail"  size = "30" value = "<%=CoRegEmail%>">
							</td>
						</tr>
					</table>


				  </td>
			  </tr>
		</table>
		
					<table width = "600" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
							
							<tr><td height = "1" bgcolor = "#abacab"><Img src = "images/px.gif" height = "0" width = "0"></td></tr>
							<tr>
								<td class = "body">
										REGISTRANT PASSWORD<BR>
											Password should be 5-12 characters long.<BR>
											<BR>
  <label>Password: <input name="password" type="password" value="<%=password%>"></label>
  <label>Confirm password: <input name="confirm" type="password" value="<%=password%>"></label>
</td>
							</tr>
							<tr>
									<td  align = "center">
										<input type=button value="Save Changes"  class = "regsubmit2" onclick="verify();">


									</td>
							</tr>
					</table>

	</form>
<br><br><br>
									</td>
							</tr>
					</table>

<!--#Include virtual="Footer.asp"--> 
