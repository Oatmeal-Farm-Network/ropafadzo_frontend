<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Add Instructors</title>
<link rel="stylesheet" type="text/css" href="style.css">
<!--#Include virtual="globalVariables.asp"--> 


</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="ClassesHeader.asp"--> 


<a name="Top"></a>
 <% PageTitleText = "Add an Instructor"  %>
<!--#Include file="970Top.asp"-->
<br />
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
	  <td class="menu2">
			<% completion = request.querystring("completion")
if completion="True" then %>
  <font color = "brown"><b>Your Instructor has been added. Use the form below to add another instructor or click on the <a href = "ClassesEditInstructors.asp?EventID=<%=eventid%>" class = "menu2" >Edit Instructors</a> link to make changes.</b></font>

<% end if %>
		</td>
	</tr>
</table>

<%Currentpagename = "ClassesAddInstructors.asp"%>
<!--#Include virtual="PeopleDataInclude.asp"--> 

<form  name="form" action="ClassesAddInstructorHandleForm.asp?EventID=<%=EventID%>" method = "post">
<input name="Action" Value ="Add"  type = "hidden">
<input name="EventID" Value ="<%=EventID%>"  type = "hidden">
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
	<tr>
	<td width = "50%" valign = "top">
	   <table>
	      <tr>
			<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
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
				<td class = "body2" align = "right">
					Business Name:&nbsp;
				</td>
				<td class = "body2">
					<input name="BusinessName" Value ="<%=BusinessName%>"  size = "33" maxlength = "61">
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
					Website: &nbsp;
				</td>
				<td  align = "left" valign = "top" class = "body2">
					http://<input name="Website"  size = "30" value = "<%=Website%>">
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
						<tr>
				<td  align = "right" class = "body2">  Country:	</td>
				<td  align = "left" valign = "top" class = "body2">
					
					<select size="1" name="AddressCountry">
					<% if (AddressCountry) > 0 then %>
							<option value="<%=AddressCountry %>" selected><%=AddressCountry %></option>
					<% end if %>
						<option value="USA" selected>USA</option>
						<option value="Canada">Canada</option>
					</select>
				</td>
			</tr>

</table>

</td>
</tr>

	

<tr><td  align = "center" colspan = "2">
<TABLE>
<TR>
<td class = "body" align = "right" valign = "top">Instructor Bio:	</td>
<td class = "body" align = "right"><textarea rows="10" cols="83" name="InstructorBio"></textarea></td>
</TR>
</TABLE>

					
				<input name="PeopleID" type = "hidden"  value = "<%=PeopleID%>">
				<input type=submit class = "regsubmit2" value = "Add Instructor" >
	</form>
		</td>

	</tr>
</table>

	</form>

<br>
<table width = "900" align = "center">
   <tr><td class="Menu2" align = "center"><b><i>Note: To edit instructors please <a href="ClassesEditInstructors.asp?EventID=<%=eventid%>" class="menu2">click here</a></i></b>
   </td>
   </tr>
   </table>
<br>
<!--#Include file="970Bottom.asp"--><br>


<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
