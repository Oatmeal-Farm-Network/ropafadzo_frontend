<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>General Data Edit Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="/Administration/Header.asp"--> 

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <H2>Edit General Animal Data<br>
			<img src = "images/underline.jpg"></H2>
			To make changes to your data, make your changes in the table below then select the "Submit Changes" button at the bottom of the page.<br><br>
		</td>
	</tr>
</table>


<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from Animals  order by Animals.FullName"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim ID(40000) 
	dim	Name(40000) 
	dim	ForSale(40000) 
	dim	ARI(40000) 
	dim	DOB(40000) 
	dim	Color(40000) 
	dim	Category(40000) 
	dim	PercentPeruvian(40000) 
	dim	PercentChilean(40000) 
	dim	PercentBolivian(40000) 
	dim	PercentAccoyo(40000) 
	dim	PercentUnknownOther(40000) 
	dim	Breed(40000) 
	dim	ColorCategory(40000) 
	dim	GroupID(40000) 
	dim GroupName(40000)
		dim	PackageID(40000)
	dim PackageName(40000)

Recordcount = rs.RecordCount +1
%>

<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<th >Full Name</th>
		<th >DOB</th>
		<th >Color</th>
		<th >ARI#</th>
		<th >Category</th>
		<th >Breed</th>
		<th >PercentPeruvian</th>
		<th >PercentChilean</th>
		<th >PercentBolivian</th>
		<th >PercentAccoyo</th>
		<th >PercentUnknownOther</th>
	
	</tr>
	
<%
 While  Not rs.eof         
	ID(rowcount) =   rs("ID")
	 Name(rowcount) =   rs("FullName")
	 ARI(rowcount) =   rs("ARI")
     DOB(rowcount) =  rs("DOB")
	 Color(rowcount) =   rs("Color")
	Category(rowcount) =   rs("Category")
	 Breed(rowcount)=   rs("Breed")
	 GroupID(rowcount)=   rs("GroupID")
	 PercentPeruvian(rowcount)=   rs("PercentPeruvian")
	PercentChilean(rowcount)=   rs("PercentChilean")
	PercentBolivian(rowcount)=   rs("PercentBolivian")
	PercentAccoyo(rowcount)=   rs("PercentAccoyo")
	PercentUnknownOther(rowcount)=   rs("PercentUnknownOther")

%>

	<form action= 'Animalshandleform.asp' method = "post">
	<tr  >
		
		<td >
			<input type = "hidden" name="ID(<%=rowcount%>)" value= "<%=  ID( rowcount)%>">
		
		    <input name="Name(<%=rowcount%>)" value= "<%= Name( rowcount)%>" size = "30"></td>
		
		
		<td ><input name="DOB(<%=rowcount%>)" value="<%= DOB( rowcount)%>" size = "10"></td>
		<td width = "100" ><div id="F5T" style="overflow:hidden;"><input name="Color(<%=rowcount%>)" value="<%= Color( rowcount)%>"  ></div>
		</td>
		


			<td >
			<input name="ARI(<%=rowcount%>)" value= "<%= ARI(rowcount)%>"    size = "8"></td>
			<td width = "100">
			<select size="1" name="Category(<%=rowcount%>)">
					<option name = "Category1" value= "<% = Category(rowcount)%>" selected><% = Category(rowcount)%></option>
					<option name = "Category3" value="N/A">N/A</option>
					<option name = "Category11" value="Jr. Herdsire">Jr. Herdsire</option>
				     <option name = "Category12" value="Herdsire">Herdsire</option>
				     <option name = "Category13" value="Maiden">Maiden</option>
				     <option name = "Category14" value="Dam">Dam</option>
				     <option name = "Category15" value="Non-Breeder">Fiber/Companion</option>
				     <option name = "Category16" value="External Stud">External Stud</option>
				     <option name = "Category17" value="Unowned Animal">Unowned Animal</option>
					</select>
			
		</td>
		<td width = "100">
			<select size="1" name="Breed(<%=rowcount%>)">
				<option name = "breed1" value= "<% = breed(rowcount)%>" selected><% = breed(rowcount)%></option>
					<option name = "Breed3" value="Huacaya">Huacaya</option>
					<option name = "Breed1" value="Suri">Suri</option>
					<option name = "Breed11" value="Poco-Vicuna">Poco-vicuna</option>
					</select>

			
		</td>
			<td width = "100">
			<select size="1" name="PercentPeruvian(<%=rowcount%>)">
					<option name = "PercentPeruvian1" value= "<% =  PercentPeruvian(rowcount)%>" selected><% =  PercentPeruvian(rowcount)%></option>
					<option name = "PercentPeruvian2" value="0">0%</option>
					<option name = "PercentPeruvian3" value="1/8">1/8</option>
				     <option name = "PercentPeruvian4" value="1/4">1/4</option>
				     <option name = "PercentPeruvian5" value="3/8">3/8</option>
				     <option name = "PercentPeruvian6" value="1/2">1/2</option>
				     <option name = "PercentPeruvian7" value="5/8">5/8</option>
				     <option name = "PercentPeruvian8" value="3/4">3/4</option>
				     <option name = "PercentPeruvian9" value="7/8">7/8</option>
					  <option name = "PercentPeruvian10" value="FullPeruvian">Full Peruvian</option>
			 </select>
			
		</td>
	<td width = "100">
			<select size="1" name="PercentChilean(<%=rowcount%>)">
					<option name = "PercentChilean1" value= "<% =  PercentChilean(rowcount)%>" selected><% =  PercentChilean(rowcount)%></option>
					<option name = "PercentChilean2" value="0">0%</option>
					<option name = "PercentChilean3" value="1/8">1/8</option>
				     <option name = "PercentChilean4" value="1/4">1/4</option>
				     <option name = "PercentChilean5" value="3/8">3/8</option>
				     <option name = "PercentChilean6" value="1/2">1/2</option>
				     <option name = "PercentChilean7" value="5/8">5/8</option>
				     <option name = "PercentChilean8" value="3/4">3/4</option>
				     <option name = "PercentChilean9" value="7/8">7/8</option>
					  <option name = "PercentChilean10" value="FullChilean">Full Chilean</option>
			 </select>
			
		</td>
		<td width = "100">
			<select size="1" name="PercentBolivian(<%=rowcount%>)">
					<option name = "PercentBolivian1" value= "<% =  PercentBolivian(rowcount)%>" selected><% =  PercentBolivian(rowcount)%></option>
					<option name = "PercentBolivian2" value="0">0%</option>
					<option name = "PercentBolivian3" value="1/8">1/8</option>
				     <option name = "PercentBolivian4" value="1/4">1/4</option>
				     <option name = "PercentBolivian5" value="3/8">3/8</option>
				     <option name = "PercentBolivian6" value="1/2">1/2</option>
				     <option name = "PercentBolivian7" value="5/8">5/8</option>
				     <option name = "PercentBolivian8" value="3/4">3/4</option>
				     <option name = "PercentBolivian9" value="7/8">7/8</option>
					  <option name = "PercentBolivian10" value="FullBolivian">Full Bolivian</option>
			 </select>
			
		</td>
			<td width = "100">
			<select size="1" name="PercentAccoyo(<%=rowcount%>)">
					<option name = "PercentAccoyo1" value= "<% =  PercentAccoyo(rowcount)%>" selected><% =  PercentAccoyo(rowcount)%></option>
					<option name = "PercentAccoyo2" value="0">0%</option>
					<option name = "PercentAccoyo3" value="1/8">1/8</option>
				     <option name = "PercentAccoyo4" value="1/4">1/4</option>
				     <option name = "PercentAccoyo5" value="3/8">3/8</option>
				     <option name = "PercentAccoyo6" value="1/2">1/2</option>
				     <option name = "PercentAccoyo7" value="5/8">5/8</option>
				     <option name = "PercentAccoyo8" value="3/4">3/4</option>
				     <option name = "PercentAccoyo9" value="7/8">7/8</option>
					  <option name = "PercentAccoyo10" value="FullAccoyo">Full Accoyo</option>
			 </select>
			
		</td>
		<td width = "100">
			<select size="1" name="PercentUnknownOther(<%=rowcount%>)">
					<option name = "PercentUnknownOther1" value= "<% =  PercentUnknownOther(rowcount)%>" selected><% =  PercentUnknownOther(rowcount)%></option>
					<option name = "PercentUnknownOther2" value="0">0%</option>
					<option name = "PercentUnknownOther3" value="1/8">1/8</option>
				     <option name = "PercentUnknownOther4" value="1/4">1/4</option>
				     <option name = "PercentUnknownOther5" value="3/8">3/8</option>
				     <option name = "PercentUnknownOther6" value="1/2">1/2</option>
				     <option name = "PercentUnknownOther7" value="5/8">5/8</option>
				     <option name = "PercentUnknownOther8" value="3/4">3/4</option>
				     <option name = "PercentUnknownOther9" value="7/8">7/8</option>
					  <option name = "PercentUnknownOther10" value="FullPeruvian">100% Unknown or Other</option>
			 </select>
			
		</td>
		</tr>
<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = nothing
%>

<tr>
		<td colspan = "16" align = "center" valign = "middle">
			<img src = "images/underline.jpg"><br>
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>
 
<!--#Include virtual="/Administration/Footer.asp"--> </Body>
</HTML>