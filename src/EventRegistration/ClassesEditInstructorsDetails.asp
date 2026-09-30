<%@ Language="VBScript" %> 

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Sponsor</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<% PeopleIDNeeded = True %>
<!--#Include file="Header.asp"-->


<!--#Include file="ClassesHeader.asp"-->
<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body"><br>
			<H2>Edit Instructor</H2>
		</td>
	</tr>
		<tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  <tr>
    <td class="Menu2">
<% Completion = request.querystring("Completion")

if Completion="True" then %>
  <font color = "Brown">Your Instructor has been added. Use the form below to add another instructor or click on the <a href = "ClassesEditInstructors.asp?EventID=36" class = "Menu2" >Edit Instructors</a> link to make changes.</font>

<% end if %>
			
		</td>
	</tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"


PeopleID= request.querystring("PeopleID")

 sql = "select * from People, Address where People.AddressID = Address.AddressID and  People.instructor = True and PeopleID=" & PeopleID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	if Not rs.eof then
	PeopleBio = rs("PeopleBio")
	PeopleFirstName = rs("PeopleFirstName")
	PeopleLastName = rs("PeopleLastName")
	Peoplefax = rs("Peoplefax")
	PeopleID = rs("PeopleID")
	BusinessID = rs("BusinessID")
	Peopleemail = rs("Peopleemail")
	PeopleCell = rs("PeopleCell")
	PeoplePhone = rs("PeoplePhone")
	CellPhone = rs("PeopleCell")
	AddressStreet = rs("AddressStreet")
	AddressApt = rs("AddressApt")
	AddressCity = rs("AddressCity")
	AddressState = rs("AddressState")
	AddressZip = rs("AddressZip")
	AddressCountry = rs("AddressCountry")
	AddressID = rs("AddressID")
    AddressCountry = rs("AddressCountry")
    PeopleImage1 = rs("PeopleImage1")
    WebsitesID=rs("WebsitesID")
    rs.close 
    
    if (BusinessID) > 0 then
    sql = "select * from Business where BusinessID = " & BusinessID  & " order by BusinessID Desc "
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		BusinessName = rs("BusinessName")
	End If 
rs.close
  end if
    
    
  if (WebsitesID) > 0 then
    sql = "select Website from Websites where WebsitesID = " & WebsitesID  & " order by WebsitesID Desc "
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			Website = rs("Website")
	End If 
rs.close
  end if
  
  
	%>
	<form  action="editsInstructorhandle.asp?EventID=<%=EventID%>" method = "post">
	<input type = "hidden" name="EventID" value= "<%= EventID %>" >

<a name = "<%=SponsorID%>"><a>

	<input type = "hidden" name="SponID" value= "<%= SponID %>" >
	<input type = "hidden" name="WebsiteID" value= "<%= WebsiteID %>" >
	<input type = "hidden" name="AddressID" value= "<%=AddressID %>" >
	
	<input name="BusinessPhoneID" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
	<input name="BusinessID" Value ="<%=BusinessID%>"  type = "hidden">
	<input name="PeopleID" Value ="<%=PeopleID%>"  type = "Hidden">
	<input name="SponsorID" Value ="<%=SponsorID%>"  type = "Hidden">
	<table border = "0" width = "940"  align = "center" bgcolor = "white">

<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
	<tr>
	<td width = "500">
	   <table border = "0" width = "500">
	      <tr>
			<td class = "body2" align = "right" WIDTH = "120">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "380">
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
					Business Name: &nbsp;
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
				<input name="WebsitesID"  Type="Hidden" value = "<%=WebsitesID%>">
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
				<td  align = "right" class = "body2">Country: &nbsp;</td>
				<td  align = "left" valign = "top" class = "body2">
					
					<select size="1" name="AddressCountry">
					<% if AddressCountry= "Canada" then %>
			<option value="Canada" selected>Canada</option>
							<option value="USA" >USA</option>
						

					<% else %>
						<option value="USA" selected>USA</option>
						<option value="Canada">Canada</option>
						<% end if %>
					</select>
				</td>
			</tr>
		<TR>
<td class = "body" align = "left" valign = "top" colspan = "2">Instructor Bio:	

 <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script>
 		  

<textarea cols="60" rows="6" name="PeopleBio" class = "body2"  id = "textarea1"><%=PeopleBio %></textarea></td>
</TR>
		<% showdelete = False
		if showdelete = True then %>	   
			   <tr>
	  <td class = "body2" align = "right" ></td>
  		<td class = "body2"bgcolor = "brown" >
		<input TYPE="Checkbox" name="Delete" Value = "Yes" ><font color = "white">Delete</font>
		</td>
	</tr>
	
	<% end if %>
	<tr>
	    <td align = "center" colspan = "2">
		    <input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" align = "center"><br>
           <input type="submit"  value="Submit Changes" class = "Regsubmit2" >
								 
</td>
</tr>
</table>
</form>

</td>
<td bgcolor = "black" width= "1"><img src = "images/px.gif" width = "1" height = "1"></td>
<td width = "400" valign = "top">
	<table Border = "0" width = "150" align = "center">
			<tr>
				<td >
					<h2>Instructor's Photo</h2>
				</td>
			</tr>
			<tr>
				<td width = "100" align = "center" class="body">
					<% If Len(PeopleImage1) > 2 Then %>
							<img src = "<%=PeopleImage1%>" height = "100">
					<% Else %>
							<b>No Image</b>
					<% End If %>
				</td>
			</tr>
				<tr>
				<td class = "body">
					<table>
					   <tr>
					     <td class = "body">
							<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesInstructoruploadImage.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>" >
								Upload Photo: <br>Images must be in JPG, JPEG, GIF, or PNG format and under 500KB in size.
								<input name="attach1" type="file" size=35 class = "regsubmit2">
								<center><input  type=submit value="Upload" class = "regsubmit2" ></center>
							</form>
							
						<td>
						</tr>
						<% If Len(PeopleImage1) > 2 Then %>
						<tr>
					    <td class = "body">
							<form action= 'ClassesInstructorRemoveImage.asp' method = "post">
								<input type = "hidden" name="PeopleID" value= "<%=PeopleID%>" >
								<center><input type=submit class = "regsubmit2"  value="Remove This Image"></center>
							</form>
					</td>
				</tr>
				<% End If %>
				</table>
	   <td>
	 </tr>
</table>
</tD>
</tr>
</table>




<% end if		
%>
<center><a href = "ClassesEditInstructors.asp?EventID=<%=EventID%>" class = "Menu2">Return to Edit Instructors page</a></center>
<br><br>

	
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>