<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ Language=VBScript %>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <title>Edit Pages</title>
       <link rel="stylesheet" type="text/css" href="style.css">
	

</HEAD>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">
<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="Header.asp"--> 
<!--#Include file="PeopleHeader.asp"--> 
<% PageTitleText = "Edit Contacts"  %>
<!--#Include file="970Top.asp"-->


<table width = "965" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr ><td align = "center">


<% 
CurrentPeopleID = request.QueryString("CurrentPeopleID")

 sql = "select distinct People.*, address.*  from People, Address where People.AddressID = Address.AddressID and People.AddressID = Address.AddressID and people.PeopleID = " & CurrentPeopleID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   


if  Not rs.eof then   
PeopleEmail = rs("PeopleEmail")
PeopleFirstName = rs("PeopleFirstName")
PeopleLastName = rs("PeoplelastName")
PeoplePhone = rs("PeoplePhone")
AddressApt = rs("AddressApt")
AddressCity= rs("AddressCity")
AddressState = rs("AddressState")
AddressZip = rs("AddressZip")
AddressCountry = rs("AddressCountry")
 AddressStreet = rs("AddressStreet")
 WebsitesID = rs("WebsitesID")
PeopleCell = rs("PeopleCell")
 PeopleFax= rs("Peoplefax")
 

 rs.close
  end if
  
 sql = "select distinct * from People, Business where People.BusinessID = Business.BusinessID and  people.PeopleID = " & CurrentPeopleID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 if  Not rs.eof then 
 BusinessName = rs("BusinessName")
 BusinessLogo = rs("BusinessLogo")
 BusinessID = rs("BusinessID")
end if



if len(WebsitesID) > 0 then
 sql = "select distinct * from Websites where WebsitesID = " & WebsitesID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 if  Not rs.eof then 
PeopleWebsite = rs("Website")
end if
end if

%>

<table border = "0"  cellpadding=0 cellspacing=0 width = "960" align = "center" >
<tr><td width = "444" valign = "top">

<% PageTitleText = "Name & Address"  %>
<!--#Include file="444Top.asp"--> 
<form  name=form method="post" action="ContactsUpdateAccount.asp">
<table width = "442" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
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
					Business Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="BusinessName" Value ="<%=BusinessName%>"  size = "33" maxlength = "61">
				</td>
			</tr>	
			
<tr>
	<td class = "body2" align = "right">
			Website: &nbsp;
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
		<td class = "body2" align = "right">
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
			<td  align = "right" class = "body2">
				<small>Country: </small>	
			</td>
			<td  align = "left" valign = "top" class = "body2">
					
				<select size="1" name="AddressCountry">
				<% if AddressCountry = "Canada" then %>
					<option value="USA" >USA</option>
					<option value="Canada" selected>Canada</option>
				<% else %>
					<option value="USA"  selected>USA</option>
					<option value="Canada">Canada</option>
				<% end if %>
				</select>
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
		<tr><td  align = "center" colspan = "2">
        <input name="CurrentPeopleID" type = "hidden"  value = "<%=CurrentPeopleID%>">
         <input name="EventID" type = "hidden"  value = "<%=EventID%>">
		<center><input type=submit value="Update Account" class = "regsubmit2" ></center>		
</td></tr>
</table></form>		
				
<!--#Include file="444Bottom.asp"--> 
</td>
<td width = "5"><img src= "images/px.gif" height = "1" width = "1" /></td>
<td valign = "top" class = "body">
<% PageTitleText = "Upload Logo"  %>
<!--#Include file="505Top.asp"-->

<table border = "0"  cellpadding=0 cellspacing=0 width = "442" height = "200" align = "center" >
<tr><td width = "442" valign = "top" class = "body"><bfr><br /></br>
	<% If Len(BusinessLogo) > 2 Then %>
							<img src = "<%=BusinessLogo%>" height = "100">
					<% Else %>
							<b>No Image</b>
					<% End If %>

<td>
</tr>
<tr>
<td class=  "body">
<form name="frmSend" method="POST" enctype="multipart/form-data" action="LogouploadImage.asp?BusinessID=<%=BusinessID%>&CurrentPeopleID=<%=CurrentPeopleID%>" >
								Upload Logo: <br>Images must be in JPG, JPEG, GIF, or PNG format and under 500KB in size.
								<input name="attach1" type="file" size=65 class = "regsubmit2">
								<center><input  type=submit value="Upload" class = "regsubmit2" ></center>
							</form>
							
						<td>
						</tr>
						<% If Len(BusinessLogo) > 2 Then %>
						<tr>
					    <td class = "body">
		<form action= 'LogoRemoveImage.asp' method = "post">
		<input type = "hidden" name="BusinessID" value= "<%=BusinessID%>" >
		<input type = "hidden" name="CurrentPeopleID" value= "<%=CurrentPeopleID%>" >
		<center><input type=submit class = "regsubmit2"  value="Remove This Image"></center>
		</form>
	</td>
</tr>

<% End If %>
</table>

<!--#Include file="505Bottom.asp"-->
</td>
</tr>
</table>

 </td></tr></table>
 
 <!--#Include file="970Bottom.asp"-->
 
 
<!--#Include file="Footer.asp"--> </Body>
</HTML>